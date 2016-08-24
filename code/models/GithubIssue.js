// @flow

const Model = require('../Model');

type Props = {
    id: number;
    url: string;
    repositoryUrl: string;
    labelsUrl: string;
    commentsUrl: string;
    eventsUrl: string;
    htmlUrl: string;
    number: number;
    state: 'open' | 'closed';
    title: string;
    body: string;
    user: {
        login: string;
        id: number;
        avatarUrl: string;
        gravatarId: string;
        url: string;
        htmlUrl: string;
        followersUrl: string;
        followingUrl: string;
        gistsUrl: string;
        starredUrl: string;
        subscriptionsUrl: string;
        organizationsUrl: string;
        reposUrl: string;
        eventsUrl: string;
        receivedEventsUrl: string;
        type: 'User' | 'Organization';
        siteAdmin: boolean;
    };
    labels: Array<{
      url: string;
      name: string;
      color: string;
    }>;
    assignee: {
        login: string;
        id: number;
        avatarUrl: string;
        gravatarId: string;
        url: string;
        htmlUrl: string;
        followersUrl: string;
        followingUrl: string;
        gistsUrl: string;
        starredUrl: string;
        subscriptionsUrl: string;
        organizationsUrl: string;
        reposUrl: string;
        eventsUrl: string;
        receivedEventsUrl: string;
        type: 'User' | 'Organization';
        siteAdmin: boolean;
    };
    milestone: {
        url: string;
        htmlUrl: string;
        labelsUrl: string;
        id: number;
        number: number;
        state: 'open' | 'closed';
        title: string;
        description: string;
        creator: {
            login: string;
            id: number;
            avatarUrl: string;
            gravatarId: string;
            url: string;
            htmlUrl: string;
            followersUrl: string;
            followingUrl: string;
            gistsUrl: string;
            starredUrl: string;
            subscriptionsUrl: string;
            organizationsUrl: string;
            reposUrl: string;
            eventsUrl: string;
            receivedEventsUrl: string;
            type: 'User' | 'Organization';
            siteAdmin: boolean;
        };
        openIssues: number;
        closedIssues: number;
        createdAt: sring;
        updatedAt: sring;
        closedAt: sring;
        dueOn: sring;
    };
    locked: boolean;
    comments: number;
    pullRequest: {
        url: string;
        htmlUrl: string;
        diffUrl: string;
        patchUrl: string;
    };
    closedAt: string;
    createdAt: string;
    updatedAt: string;
    closedBy: {
        login: string;
        id: number;
        avatarUrl: string;
        gravatarId: string;
        url: string;
        htmlUrl: string;
        followersUrl: string;
        followingUrl: string;
        gistsUrl: string;
        starredUrl: string;
        subscriptionsUrl: string;
        organizationsUrl: string;
        reposUrl: string;
        eventsUrl: string;
        receivedEventsUrl: string;
        type: 'User' | 'Organization';
        siteAdmin: boolean
    };
};

module.exports = class GithubNotification extends Model {

    props: Props;

};
