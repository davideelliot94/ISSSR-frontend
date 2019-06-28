'use strict';

/**
 *  @ngdoc  service
 *  @module  ticketsystem.restService
 *  @name   restService
 *  @description   Service manages the endpoints for REST API call.
 */
mainAngularModule.service('restService', function (BACKEND_BASE_URL) {
    let CONNECTION = {url: BACKEND_BASE_URL};

    return {

        //  Login
        "login": CONNECTION.url + '/users/login',

        //  CRUD Ticket
        "createTicket": CONNECTION.url + '/tickets',
        "insertComment": CONNECTION.url + '/tickets/insertComment',

        //  TODO dopo la rivisitazione delle SM, vanno tolti...?
        //  SM
        "findTicketByStatus": CONNECTION.url + '/tickets/findTicketByStatus',
        "validationTickets": CONNECTION.url + '/tickets/findTicketByStatus/VALIDATION',
        "pendingTickets": CONNECTION.url + '/tickets/findTicketByStatus/PENDING',
        "editTickets": CONNECTION.url + '/tickets/findTicketByStatus/EDIT',
        "executionTickets": CONNECTION.url + '/tickets/findTicketByStatus/EXECUTION',
        "discardedTickets": CONNECTION.url + '/tickets/findTicketByStatus/DISCARDED',
        "resolvedTickets": CONNECTION.url + '/tickets/findTicketByStatus/RESOLVED',
        "closedTickets": CONNECTION.url + '/tickets/findTicketByStatus/CLOSED',

        "updateTickets": CONNECTION.url + '/tickets/getTicketById2',
        "updt": CONNECTION.url + '/tickets/upd',

        //  Ticket by openerUser
        "readMyTickets": CONNECTION.url + '/tickets/ticketByOpenerUser',

        //  Ticket by resolverUser
        //"readMyAssignedTickets": CONNECTION.url + '/tickets/ticketByResolverUser',
        "readMyAssignedTickets": CONNECTION.url + '/tickets/ticketByAssignee',

        //  Change ticket state
        "changeTicketState": CONNECTION.url + '/tickets/changeState',

        "getPlanningAndChangeTicketState": CONNECTION.url + '/tickets/getPlanningAndChangeTicketState',
        //  Team Leader
        "teamLeader": CONNECTION.url + '/users/team_leader',
        "employedTeamLeader": CONNECTION.url + '/users/employed_team_leader',

        //  Team Coordinator
        "assignTicket": CONNECTION.url + '/tickets/assignTicket',

        //  CRUD Registered User
        "createUser": CONNECTION.url + '/registered_user',
        "getUser": CONNECTION.url + '/registered_user',
        "deleteUser": CONNECTION.url + '/registered_user',
        "updateUser": CONNECTION.url + '/registered_user',

        "createTarget": CONNECTION.url + '/targets',

        //  Target
        "readTargets": CONNECTION.url + '/targets',
        "readActiveTargets": CONNECTION.url + '/targets/active',

        // State Machine
        "getStateMachines": CONNECTION.url + '/state_machine',

        //  Team
        "getTeamMembers": CONNECTION.url + '/users/free_team_member',
        "getTeamLeaders": CONNECTION.url + '/users/team_leader',
        "getFreeTeamLeaders": CONNECTION.url + '/users/free_team_leader',
        "getMembersByTeamId": CONNECTION.url + '/teams/team_member',
        "getLeaderByTeamId": CONNECTION.url + '/teams/team_leader',

        //  TeamMembers by TeamLeader
        "getTeamMembersByTeamLeader": CONNECTION.url + '/teams/team_member/team_leader',

        //  TeamLeader by Team ID
        "getTeamLeaderByTeamID": CONNECTION.url + '/teams/team_leader',

        //  Get TeamCoordinator
        "getTeamCoordinator": CONNECTION.url + '/users/team_coordinator',

        "createTeam": CONNECTION.url + '/teams',
        "createScrumTeam": CONNECTION.url + '/scrumteam',

        "getTeams": CONNECTION.url + '/teams',
        "updateTeamMember": CONNECTION.url + '/teams/add_team_member',

        //  Info about current state and future states of a ticket
        "getStateInformation": CONNECTION.url + '/tickets/getStateInformation',

        //  Get user by role
        "getUserByRole": CONNECTION.url + '/users/getUserByRole',
        "getEmployedUserByRole": CONNECTION.url + '/users/getEmployedUserByRole',

        //  change ticket difficulty
        "changeTicketDifficulty": CONNECTION.url + '/tickets/changeDifficulty',

        "insertUserInGroup": CONNECTION.url + '/groups/insertUserInGroup',

        "getMaxId": CONNECTION.url + '/users/getMaxId',

        "getScrumTeamList": CONNECTION.url + '/scrumteam/getScrumTeamList',

        "getProductOwnerBySTId": CONNECTION.url + '/scrumteam/getProductOwnerBySTId',

        "getScrumTeamBySTId": CONNECTION.url + '/scrumteam/getScrumMasterSTId',

        "getMembersBySTId": CONNECTION.url + '/scrumteam/getMembersBySTId',

        "assignProductToST": CONNECTION.url + '/scrumteam/assignProductToST',

        "closeSprint": CONNECTION.url + '/sprint/close',

        "getFinishedBacklogItem": CONNECTION.url + '/backlog/getFinishedBacklogItems',

        "getDates": CONNECTION.url + '/sprint/getDates',

        "getStoryPint": CONNECTION.url + '/backlog/getStoryPoint'


    };
})
