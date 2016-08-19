// @flow

const Model = require('../Model');
const LazyPromiseArray = require('../LazyPromiseArray');
const _ = require('lodash');
const Querystring = require('querystring');
const assert = require('assert');
const URL = require('url');

type Props = {
    id: string;
    repository: {
        id: number;
        name: string;
        fullName: string;
        description: string;
    };
    subject: {
        title: string;
        url: string;
        latestCommentUrl: string;
        type: "Issue";
    };
};

const PER_PAGE = 50;

module.exports = class GithubNotification extends Model<Props> {

    static all: LazyPromiseArray<GithubNotification> = new LazyPromiseArray(() => {

        const fetchPage = _.memoize((index) =>
            fetch('https://api.github.com/notifications?' + Querystring.stringify({
                access_token: process.env.GITHUB_TOKEN,
                per_page: PER_PAGE,
                page: index,
                all: false // only show unread notifications
            })).then((response) =>
                response.json().then((json) =>
                    ({link: response.headers.get('Link'), items: json})
                )
            )
        );

        return {
            length: fetchPage(0).then((firstPage) => {
                const lastPageIndex = parseLinkHeader(firstPage.link).last;
                return fetchPage(lastPageIndex).then((lastPage) => {
                    return lastPageIndex * PER_PAGE + lastPage.items.length
                })
            }),

            fetchAtIndex: _.memoize((index: number): Promise<GithubNotification> =>
                fetchPage(Math.floor(index / PER_PAGE)).then((page) =>
                    new GithubNotification(page.items[index % PER_PAGE])
                )
            )
        };
    });

};

function parseLinkHeader(header) {
    assert(header.length);

    const links = header.split(',');
    const output = {};

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const linkParts = link.split(';');
        assert(linkParts.length === 2);
        const index = parseInt(URL.parse(linkParts[0].slice(1, -1), true).query.page);
        const name = linkParts[1].replace(/rel="(.+)"/, '$1').trim();
        output[name] = index;
    }

    return output;
}
