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
    // TODO:
    // 1. Add loan status
    // 2. display a user group
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
    mapping(int256 => Group) public groups;
    mapping(address => int256[]) private userGroups;
    uint256 public groupCount;
    mapping(address => mapping(int256 => Loan)) public loans;
    uint256 public constant LOAN_DURATION = 90 days; // 3 months
    uint256 public constant LOAN_INTEREST_RATE = 5; // 5%
    uint256 public constant LOCK_PERIOD = 365 days; // 12 months
    uint256 public constant LOAN_PRECISION = 3;

    ///////////////////////////
    // Events               //
    //////////////////////////
    event GroupCreated(int256 indexed groupId, string name, address admin);
    event MemberJoined(int256 indexed groupId, address indexed member);
    event DepositMade(int256 indexed groupId, address member, uint256 amount);
    event SavingsDeposited(
        int256 indexed groupId,
        address member,
        uint256 amount
    );
    event LoanDistributed(
        int256 indexed groupId,
        address borrower,
        uint256 amount,
        bool isFirstBatch
    );
    event LoanRepayment(
        int256 indexed groupId,
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
        address user,
        int256 _groupId
    ) external {
        groupCount++;
        Group storage newGroup = groups[_groupId];
        // newGroup.monthlyContribution = _monthlyContribution;
        newGroup.creationTime = block.timestamp;
        newGroup.name = _name;
        newGroup.admin = msg.sender;
        _joinGroup(_groupId, user);

        emit GroupCreated(_groupId, _name, msg.sender);
    }

    function setMonthlyContribution(int256 _groupId, uint256 _amount) external {
        Group storage group = groups[_groupId];

        require(
            group.monthlyContribution == 0,
            "Group Contribution already set"
        );
        group.monthlyContribution = _amount;
    }

    function joinGroup(int256 _groupId, address user) external {
        _joinGroup(_groupId, user);
    }

    function deposit(int256 _groupId) public payable {
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

    function distributeLoans(int256 _groupId) external {
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

    function repayLoan(int256 _groupId, uint256 _amount) external {
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
    function _joinGroup(int256 _groupId, address user) internal {
        Group storage group = groups[_groupId];
        require(
            !groups[_groupId].addressToMember[user].isMember,
            "Already in group"
        );
        group.members.push(msg.sender);
        // group.isMember[msg.sender] = true;
        group.addressToMember[user].isMember = true;
        groups[_groupId].memberCount++;
        userGroups[user].push(_groupId);
        emit MemberJoined(_groupId, msg.sender);
    }

    function _distributeLoansTERNAL(
        int256 _groupId,
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
    struct GroupInfo {
        uint256 monthlyContribution;
        uint256 totalSavings;
        uint256 loanGivenOut;
        uint256 repaidLoan;
        uint256 creationTime;
        string name;
        address admin;
        uint256 memberCount;
    }

    function getGroups(
        int256[] memory groupIds
    ) public view returns (GroupInfo[] memory) {
        GroupInfo[] memory groupInfos = new GroupInfo[](groupIds.length);

        for (uint256 i = 0; i < groupIds.length; i++) {
            int256 groupId = groupIds[i];

            Group storage group = groups[groupId];

            groupInfos[i] = GroupInfo({
                monthlyContribution: group.monthlyContribution,
                totalSavings: group.totalSavings,
                loanGivenOut: group.loanGivenOut,
                repaidLoan: group.repaidLoan,
                creationTime: group.creationTime,
                name: group.name,
                admin: group.admin,
                memberCount: group.memberCount
            });
        }

        return groupInfos;
    }

    function getGroupMonthlySavings(
        int256 _groupId
    ) external view returns (uint256) {
        return groups[_groupId].monthlyContribution;
    }

    function getGroupTotalSavings(
        int256 _groupId
    ) public view returns (uint256) {
        return groups[_groupId].totalSavings;
    }

    function getOutStandingLoan(int256 _groupId) public view returns (uint256) {
        return loans[msg.sender][_groupId].totalAmount;
    }

    function getAmountRepaid(int256 _groupId) public view returns (uint256) {
        return loans[msg.sender][_groupId].amountRepaid;
    }

    function getGroupTotalLoanGiveOut(
        int256 _groupId
    ) public view returns (uint256) {
        return groups[_groupId].loanGivenOut;
    }

    function getGroupTotalRepaidLoan(
        int256 _groupId
    ) public view returns (uint256) {
        return groups[_groupId].repaidLoan;
    }

    function getContractTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function getUserGroups(
        address user
    ) external view returns (int256[] memory) {
        return userGroups[user];
    }
}
