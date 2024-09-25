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
import {SafeMath} from "@openzeppelin/contracts/utils/math/Math.sol";

contract ZiniSavings is ReentrancyGuard {
    ///////////////////////////
    // Type of  contract    //
    //////////////////////////
    using SafeERC20 for IERC20;

    struct Group {
        address[] members;
        uint256 monthlyContribution;
        uint256 totalSavings;
        uint256 creationTime;
        string name;
        address admin;
        uint256 memberCount;
        mapping(address => bool) isMember;
        mapping(address => uint) memberSavings;
        mapping(address => bool) hasReceivedLoan;
    }

    struct Loan {
        uint256 amount;
        uint256 dueDate;
        bool isActive;
    }

    ///////////////////////////
    // State Variables    //
    //////////////////////////
    IERC20 public immutable token;
    mapping(uint256 => Group) public groups;
    uint256 public groupCount;
    mapping(address => mapping(uint256 => Loan)) public loans;
    uint256 public constant LOAN_DURATION = 90 days; // 3 months
    uint256 public constant LAON_INTEREST_RATE = 5; // 5%
    uint256 public constant LOCK_PERIOD = 365 days; // 12 months

    ///////////////////////////
    // Events               //
    //////////////////////////
    event GroupCreated(uint256 groupId, string name, address admin);
    event MemberJoined(uint256 groupId, address member);
    event DepositMade(uint256 groupId, address member, uint256 amount);
    event SavingsDeposited(uint256 groupId, address member, uint256 amount);
    event LoanDistributed(uint256 groupId);

    ///////////////////////////
    // Functions             //
    //////////////////////////
    constructor() {}

    ///////////////////////////
    // External Functions    //
    //////////////////////////
    function createGroup(
        string memory _name,
        uint256 _monthlyContribution
    ) external {
        groupCount++;
        Group storage newGroup = groups[groupCount];
        newGroup.monthlyContribution = _monthlyContribution;
        newGroup.creationTime = block.timestamp;
        newGroup.name = _name;
        newGroup.admin = msg.sender;
        newGroup.memberCount = 1;
        _joinGroup(groupCount);

        emit GroupCreated(groupCount, _name, msg.sender);
    }

    function joinGroup(uint256 _groupId) external {
        require(_groupId <= groupCount && _groupId > 0, "Invalid group id");
        require(!groups[_groupId].isMember[msg.sender], "Already in group");
        _joinGroup(_groupId);
    }

    function deposit(uint256 _groupId) public payable {
        Group storage group = groups[_groupId];
        require(group.isMember[msg.sender], "Already in group");
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

    ///////////////////////////
    // Internal Functions    //
    //////////////////////////
    function _joinGroup(uint256 _groupId) internal {
        Group storage group = groups[_groupId];
        require(!group.isMember[msg.sender], "Already a member");
        group.members.push(msg.sender);
        group.isMember[msg.sender] = true;
        groups[_groupId].memberCount++;
        emit MemberJoined(_groupId, msg.sender);
    }
}
