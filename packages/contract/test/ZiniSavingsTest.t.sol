// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {DeployZini} from "../script/DeployZini.s.sol";
import {ZiniSavings} from "../src/ziniSavings.sol";
import {HelperConfig} from "../script/HelperConfig.s.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

contract ZiniSavingsTest is Test {
    DeployZini deployer;
    ZiniSavings ziniSavings;
    HelperConfig config;
    address token;
    address public USER_1 = makeAddr("user1");
    address public USER_2 = makeAddr("user2");
    address public USER_3 = makeAddr("user3");
    address public USER_4 = makeAddr("user4");
    uint256 public constant STARTING_ERC20_BALANCE = 10_000_000 ether;
    uint256 public constant MONTHLY_CONTRIBUTION = 10_000 ether;
    uint256 public constant CONTRACT_BALANCE = 100_000_000_000 ether;
    int256 public constant GROUP_ID = -145899;

    event GroupCreated(int256 indexed groupId, string name, address admin);
    event MemberJoined(int256 indexed groupId, address member);

    function setUp() public {
        deployer = new DeployZini();
        (ziniSavings, config) = deployer.run();
        (token, ) = config.activeNetworkConfig();
        ERC20Mock(token).mint(USER_1, STARTING_ERC20_BALANCE);
        ERC20Mock(token).mint(USER_2, STARTING_ERC20_BALANCE);
        ERC20Mock(token).mint(USER_3, STARTING_ERC20_BALANCE);
        ERC20Mock(token).mint(USER_4, STARTING_ERC20_BALANCE);
        ERC20Mock(token).mint(address(ziniSavings), CONTRACT_BALANCE);
    }

    function testuserbalance() public view {
        vm.assertEq(ERC20Mock(token).balanceOf(USER_1), STARTING_ERC20_BALANCE);
        vm.assertEq(ERC20Mock(token).balanceOf(USER_2), STARTING_ERC20_BALANCE);
        vm.assertEq(ERC20Mock(token).balanceOf(USER_3), STARTING_ERC20_BALANCE);
        vm.assertEq(ERC20Mock(token).balanceOf(USER_4), STARTING_ERC20_BALANCE);
        vm.assertEq(
            ERC20Mock(token).balanceOf(address(ziniSavings)),
            CONTRACT_BALANCE
        );
    }

    modifier _creategroup() {
        vm.startPrank(USER_1);
        ziniSavings.createGroup("Flex", USER_1, GROUP_ID);
        ziniSavings.setMonthlyContribution(GROUP_ID, MONTHLY_CONTRIBUTION);
        vm.stopPrank();
        _;
    }

    modifier _creategroupAndDeposit() {
        vm.startPrank(USER_1);
        ziniSavings.createGroup("Flex", USER_1, GROUP_ID);
        ziniSavings.setMonthlyContribution(GROUP_ID, MONTHLY_CONTRIBUTION);
        ERC20Mock(token).approve(address(ziniSavings), MONTHLY_CONTRIBUTION);
        ziniSavings.deposit(GROUP_ID);
        vm.stopPrank();

        vm.startPrank(USER_2);
        ziniSavings.joinGroup(GROUP_ID, address(USER_2));
        ERC20Mock(token).approve(address(ziniSavings), MONTHLY_CONTRIBUTION);
        ziniSavings.deposit(GROUP_ID);
        vm.stopPrank();

        vm.startPrank(USER_3);
        ziniSavings.joinGroup(GROUP_ID, address(USER_3));
        ERC20Mock(token).approve(address(ziniSavings), MONTHLY_CONTRIBUTION);
        ziniSavings.deposit(GROUP_ID);
        vm.stopPrank();

        vm.startPrank(USER_4);
        ziniSavings.joinGroup(GROUP_ID, address(USER_4));
        ERC20Mock(token).approve(address(ziniSavings), MONTHLY_CONTRIBUTION);
        ziniSavings.deposit(GROUP_ID);
        vm.stopPrank();
        _;
    }

    function testcreategroup() public {
        vm.startPrank(USER_1);
        vm.expectEmit(true, false, false, false, address(ziniSavings));
        emit GroupCreated(GROUP_ID, "Flex", address(USER_1));
        ziniSavings.createGroup("Flex", USER_1, GROUP_ID);
        vm.stopPrank();
    }

    function testGroupMonthlySavings() public _creategroup {
        uint256 monthlySavings = ziniSavings.getGroupMonthlySavings(GROUP_ID);
        assertEq(monthlySavings, MONTHLY_CONTRIBUTION);
    }

    function testJoinGroup() public _creategroup {
        vm.startPrank(USER_2);
        vm.expectEmit(true, true, false, false, address(ziniSavings));
        emit MemberJoined(GROUP_ID, USER_2);
        ziniSavings.joinGroup(GROUP_ID, address(USER_2));
        vm.stopPrank();
    }

    function testDeposit() public _creategroup {
        vm.startPrank(USER_1);
        ERC20Mock(token).approve(address(ziniSavings), MONTHLY_CONTRIBUTION);
        ziniSavings.deposit(GROUP_ID);
        uint256 ziniBalance = ERC20Mock(token).balanceOf(address(ziniSavings));
        vm.stopPrank();
        assertEq(ziniBalance, MONTHLY_CONTRIBUTION + CONTRACT_BALANCE);
    }

    function testgroupDeposit() public _creategroupAndDeposit {
        uint256 group1TotalSavings = ziniSavings.getGroupTotalSavings(GROUP_ID);
        assertEq(group1TotalSavings, MONTHLY_CONTRIBUTION * 4);
    }

    function testDistributeLoans() public _creategroupAndDeposit {
        uint256 user1BalanceBefore = ERC20Mock(token).balanceOf(USER_1);

        vm.startPrank(USER_1);
        ziniSavings.distributeLoans(GROUP_ID);
        vm.stopPrank();
        uint256 user1BalanceAfter = ERC20Mock(token).balanceOf(USER_1);
        uint256 loan = user1BalanceAfter - user1BalanceBefore;
        assert(user1BalanceAfter >= user1BalanceBefore);
        assertEq(loan, MONTHLY_CONTRIBUTION * 3);
    }

    function testGetUserOutStandingLoan() public _creategroupAndDeposit {
        vm.startPrank(USER_1);
        ziniSavings.distributeLoans(GROUP_ID);
        uint256 USER1_LOAN = ziniSavings.getOutStandingLoan(GROUP_ID);
        console.log(USER1_LOAN);
        vm.stopPrank();
    }

    function testRepayLoan() public _creategroupAndDeposit {
        vm.startPrank(USER_1);
        ziniSavings.distributeLoans(GROUP_ID);
        ERC20Mock(token).approve(
            address(ziniSavings),
            MONTHLY_CONTRIBUTION * 2
        );
        ziniSavings.repayLoan(GROUP_ID, MONTHLY_CONTRIBUTION);
        vm.stopPrank();
    }

    function testRepayAllLoansAndBorrowForOtherMembers()
        public
        _creategroupAndDeposit
    {
        vm.startPrank(USER_1);
        ziniSavings.distributeLoans(GROUP_ID);
        ERC20Mock(token).approve(
            address(ziniSavings),
            MONTHLY_CONTRIBUTION * 5
        );
        ziniSavings.repayLoan(GROUP_ID, MONTHLY_CONTRIBUTION);
        ziniSavings.repayLoan(GROUP_ID, MONTHLY_CONTRIBUTION);
        ziniSavings.repayLoan(GROUP_ID, MONTHLY_CONTRIBUTION);
        uint256 user1Loan = ziniSavings.getOutStandingLoan(GROUP_ID);
        uint256 user1AmountRepaid = ziniSavings.getAmountRepaid(GROUP_ID);
        vm.stopPrank();

        vm.startPrank(USER_2);
        ERC20Mock(token).approve(
            address(ziniSavings),
            MONTHLY_CONTRIBUTION * 5
        );
        ziniSavings.repayLoan(GROUP_ID, MONTHLY_CONTRIBUTION);
        ziniSavings.repayLoan(GROUP_ID, MONTHLY_CONTRIBUTION);
        ziniSavings.repayLoan(GROUP_ID, MONTHLY_CONTRIBUTION);

        uint256 user2Loan = ziniSavings.getOutStandingLoan(GROUP_ID);
        uint256 user2AmountRepaid = ziniSavings.getAmountRepaid(GROUP_ID);

        vm.stopPrank();

        assert(user1Loan - user1AmountRepaid == 0);
        assert(user2Loan - user2AmountRepaid == 0);

        uint256 user3BalanceBefore = ERC20Mock(token).balanceOf(USER_3);
        uint256 user4BalanceBefore = ERC20Mock(token).balanceOf(USER_4);

        ziniSavings.distributeLoans(GROUP_ID);

        uint256 user3BalanceAfter = ERC20Mock(token).balanceOf(USER_3);
        uint256 loan = user3BalanceAfter - user3BalanceBefore;
        assert(user3BalanceAfter >= user3BalanceBefore);
        assertEq(loan, MONTHLY_CONTRIBUTION * 3);

        uint256 user4BalanceAfter = ERC20Mock(token).balanceOf(USER_4);
        uint256 loan2 = user4BalanceAfter - user4BalanceBefore;
        assert(user3BalanceAfter >= user3BalanceBefore);
        assertEq(loan2, MONTHLY_CONTRIBUTION * 3);

        uint256 groupTotalRepaidLoan = ziniSavings.getGroupTotalRepaidLoan(
            GROUP_ID
        );
        console.log("Group total loan repaid: ", groupTotalRepaidLoan);
        uint256 groupTotalLoan = ziniSavings.getGroupTotalLoanGiveOut(1);
        console.log("Group total loan given out: ", groupTotalLoan);
    }

    // function testRepayLoanRevert() public _creategroupAndDeposit {
    //     // ziniSavings.distributeLoans(1);
    //     vm.startPrank(USER_1);
    //     vm.expectRevert();
    //     ziniSavings.repayLoan(1, MONTHLY_CONTRIBUTION);
    //     vm.stopPrank();
    // }
}
