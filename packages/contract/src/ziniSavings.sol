// Layout of Contract:
// version
// imports
// interfaces, libraries, contracts
// errors
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ZiniSavings is ReentrancyGuard {
    ///////////////////////////
    // Type of  contract    //
    //////////////////////////
    using SafeERC20 for IERC20;

    struct Member {
        address member;
        uint256 debtAmount;
        bool isMember;
    }
    struct Group {
        address[] members;
        uint256 monthlyContribution;
        uint256 totalSavings;
        uint256 loanGivenOut;
        uint256 repaidLoan;
        uint256 creationTime;
        bool firstHalfLoanDistributed;
        bool secondHalfLoanDistributed;
        uint256 firstBatchRepaidCount;
        string name;
        address admin;
        uint256 memberCount;
        mapping(address => Member) addressToMember;
        mapping(address => uint) memberSavings;
        mapping(address => bool) hasReceivedLoan;
    }

    struct Loan {
        uint256 totalAmount;
        uint256 amountRepaid;
        uint256 monthlyPayment;
        uint256 nextPaymentDue;
        bool fullyRepaid;
        bool isFirstBatch;
    }

    ///////////////////////////
    // State Variables    //
    //////////////////////////
    IERC20 public immutable token;
    mapping(uint256 => Group) public groups;
    uint256 public groupCount;
    mapping(address => mapping(uint256 => Loan)) public loans;
    uint256 public constant LOAN_DURATION = 90 days; // 3 months
    uint256 public constant LOAN_INTEREST_RATE = 5; // 5%
    uint256 public constant LOCK_PERIOD = 365 days; // 12 months
    uint256 public constant LOAN_PRECISION = 3;

    ///////////////////////////
    // Events               //
    //////////////////////////
    event GroupCreated(uint256 indexed groupId, string name, address admin);
    event MemberJoined(uint256 indexed groupId, address indexed member);
    event DepositMade(uint256 indexed groupId, address member, uint256 amount);
    event SavingsDeposited(
        uint256 indexed groupId,
        address member,
        uint256 amount
    );
    event LoanDistributed(
        uint256 indexed groupId,
        address borrower,
        uint256 amount,
        bool isFirstBatch
    );
    event LoanRepayment(
        uint256 indexed groupId,
        address borrower,
        uint256 amount
    );

    ///////////////////////////
    // Functions             //
    //////////////////////////
    constructor(address _token) {
        token = IERC20(_token);
    }

    ///////////////////////////
    // External Functions    //
    //////////////////////////
    function createGroup(
        string memory _name,
        uint256 _monthlyContribution,
        address user
    ) external {
        groupCount++;
        Group storage newGroup = groups[groupCount];
        newGroup.monthlyContribution = _monthlyContribution;
        newGroup.creationTime = block.timestamp;
        newGroup.name = _name;
        newGroup.admin = msg.sender;
        newGroup.memberCount = 1;
        _joinGroup(groupCount, user);

        emit GroupCreated(groupCount, _name, msg.sender);
    }

    function joinGroup(uint256 _groupId, address user) external {
        _joinGroup(_groupId, user);
    }

    function deposit(uint256 _groupId) public payable {
        Group storage group = groups[_groupId];
        require(
            token.balanceOf(msg.sender) >= group.monthlyContribution,
            "Insufficient balance"
        );
        token.safeTransferFrom(
            msg.sender,
            address(this),
            group.monthlyContribution
        );
        group.totalSavings += group.monthlyContribution;
        group.memberSavings[msg.sender] = group.memberSavings[
            msg.sender
        ] += group.monthlyContribution;

        emit SavingsDeposited(_groupId, msg.sender, group.monthlyContribution);
    }

    function distributeLoans(uint256 _groupId) external {
        Group storage group = groups[_groupId];
        require(group.members.length % 2 == 0, "Group size must be even");
        require(
            group.members.length >= 2,
            "Group must have at least 2 members"
        );
        require(
            group.totalSavings >=
                group.monthlyContribution * group.members.length,
            "Insufficient group savings"
        );

        uint256 halfGroupSize = group.members.length / 2;
        uint256 totalLoanAmount = group.totalSavings;
        uint256 individualLoanAmount = (totalLoanAmount /
            group.members.length) * LOAN_PRECISION;

        // if groupsize = 4
        // monthlyDistribution = 10k
        // totalSavings in a month = 40k
        // individual = 10; * 3;
        //

        if (!group.firstHalfLoanDistributed) {
            _distributeLoansTERNAL(
                _groupId,
                0,
                halfGroupSize,
                individualLoanAmount,
                true
            );
            group.loanGivenOut = group.totalSavings * 3;
        } else if (!group.secondHalfLoanDistributed) {
            require(
                group.firstBatchRepaidCount == halfGroupSize,
                "First batch loans not fully repaid"
            );
            _distributeLoansTERNAL(
                _groupId,
                halfGroupSize,
                group.members.length,
                individualLoanAmount,
                false
            );
            group.secondHalfLoanDistributed = true;
            group.loanGivenOut = group.totalSavings * 3;
        } else {
            revert("All loans have been distributed");
        }
    }

    function repayLoan(uint256 _groupId, uint256 _amount) external {
        Group storage group = groups[_groupId];
        Loan storage loan = loans[msg.sender][_groupId];
        require(loan.totalAmount > 0, "No active loan");
        require(!loan.fullyRepaid, "Loan already repaid");
        uint256 amountDue = loan.monthlyPayment;
        require(
            token.balanceOf(msg.sender) >= amountDue,
            "Insufficient balance for repayment"
        );
        if (_amount >= amountDue) {
            token.safeTransferFrom(msg.sender, address(this), _amount);
            loan.amountRepaid += _amount;
            group.repaidLoan += _amount;

            emit LoanRepayment(_groupId, msg.sender, _amount);
        } else {
            token.safeTransferFrom(msg.sender, address(this), _amount);
            loan.amountRepaid += amountDue;
            group.repaidLoan += _amount;
            emit LoanRepayment(_groupId, msg.sender, amountDue);
        }

        if (loan.amountRepaid >= loan.totalAmount) {
            loan.fullyRepaid = true;

            if (loan.isFirstBatch) {
                group.firstBatchRepaidCount++;
            }
        } else {
            loan.nextPaymentDue += 30 days;
        }
    }

    function getTestTokens() public {
        uint256 AIR_DROP = 50_000 ether;
        token.transfer(msg.sender, AIR_DROP);
    }

    ///////////////////////////
    // Internal Private Functions    //
    //////////////////////////
    function _joinGroup(uint256 _groupId, address user) internal {
        Group storage group = groups[_groupId];
        require(_groupId <= groupCount && _groupId > 0, "Invalid group id");
        require(
            !groups[_groupId].addressToMember[user].isMember,
            "Already in group"
        );
        group.members.push(msg.sender);
        // group.isMember[msg.sender] = true;
        group.addressToMember[user].isMember = true;
        groups[_groupId].memberCount++;
        emit MemberJoined(_groupId, msg.sender);
    }

    function _distributeLoansTERNAL(
        uint256 _groupId,
        uint256 startIndex,
        uint256 endIndex,
        uint256 loanAmount,
        bool isFirstBatch
    ) internal nonReentrant {
        Group storage group = groups[_groupId];

        uint256 totalLoanWithInterest = loanAmount +
            ((loanAmount * LOAN_INTEREST_RATE) / 100);
        uint256 monthlyPayment = totalLoanWithInterest / 3;

        for (uint i = startIndex; i < endIndex; i++) {
            address borrower = group.members[i];
            require(
                !group.hasReceivedLoan[borrower],
                "Member already received a loan"
            );

            token.safeTransfer(borrower, loanAmount);
            loans[borrower][_groupId] = Loan({
                totalAmount: totalLoanWithInterest,
                amountRepaid: 0,
                monthlyPayment: monthlyPayment,
                nextPaymentDue: block.timestamp + 30 days,
                fullyRepaid: false,
                isFirstBatch: isFirstBatch
            });
            group.hasReceivedLoan[borrower] = true;
            emit LoanDistributed(_groupId, borrower, loanAmount, isFirstBatch);
        }

        if (isFirstBatch) {
            group.firstHalfLoanDistributed = true;
            group.secondHalfLoanDistributed = false;
        } else {
            group.firstHalfLoanDistributed = false;
            group.secondHalfLoanDistributed = true;
        }
    }

    ///////////////////////////
    // Public View Functions    //
    //////////////////////////

    function getGroupMonthlySavings(
        uint256 _groupId
    ) external view returns (uint256) {
        return groups[_groupId].monthlyContribution;
    }

    function getGroupTotalSavings(
        uint256 _groupId
    ) public view returns (uint256) {
        return groups[_groupId].totalSavings;
    }

    function getOutStandingLoan(
        uint256 _groupId
    ) public view returns (uint256) {
        return loans[msg.sender][_groupId].totalAmount;
    }

    function getAmountRepaid(uint256 _groupId) public view returns (uint256) {
        return loans[msg.sender][_groupId].amountRepaid;
    }

    function getGroupTotalLoanGiveOut(
        uint256 _groupId
    ) public view returns (uint256) {
        return groups[_groupId].loanGivenOut;
    }

    function getGroupTotalRepaidLoan(
        uint256 _groupId
    ) public view returns (uint256) {
        return groups[_groupId].repaidLoan;
    }

    function getContractTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
