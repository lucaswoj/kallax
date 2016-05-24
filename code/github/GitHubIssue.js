// @flow

const URL = require('url');
const {EventEmitter} = require('events');

class GitHubIssue extends EventEmitter {

    title: string;
    body: string;
    id: number;

    static search(
            query: string,
            sort: "comments" | "created" | "updated",
            order: "asc" | "desc"
    ): AsyncIterator<GitHubIssue> {
        return fetchIssues('search/issues', {q: query, sort: sort, order: order});
    }

    constructor(options: Serialized) {
        super();
        this.title = options.title;
        this.body = options.body;
        this.id = options.id;
    }

    get isRead(): boolean {
        return JSON.parse(localStorage.getItem(this.localStorageKey) || 'false');
    }

    set isRead(value: boolean) {
        this.emit('change');
        localStorage.setItem(this.localStorageKey, JSON.stringify(value));
    }

    get localStorageKey(): string {
        return JSON.stringify(['kallax', 'GitHubIssue', this.id]);
    }

}

module.exports = GitHubIssue;

type Serialized = {
    title: string;
    body: string;
    id: number;
}

function fetchIssues(pathname, query): AsyncIterator<GitHubIssue> {
    const pages = [];

    function fetchIssue(index, pathname, query) {
        const pageIndex = Math.floor(index / ISSUES_PER_PAGE);
        pages[pageIndex] = pages[pageIndex] || fetchIssuesPage(pageIndex, pathname, query);

        return pages[pageIndex].then((page) => {
            if (index < page.total_count) {
                return {
                    value: new GitHubIssue(page.items[index % ISSUES_PER_PAGE]),
                    done: false
                };

            } else {
                return {
                    value: null,
                    done: true
                };
            }
        });
    }

    let index = 0;
    return {
        next: () => fetchIssue(index++, pathname, query),
        done: false,
        value: null
    };

}

const ISSUES_PER_PAGE = 100;

function fetchIssuesPage(pageIndex, pathname, query) {
    const url = URL.format({
        protocol: 'https',
        hostname: 'api.github.com',
        pathname: pathname,
        query: Object.assign({}, {
            access_token: process.env['GITHUB_ACCESS_TOKEN'],
            page: pageIndex,
            per_page: ISSUES_PER_PAGE
        }, query)
    });

    return fetch(url, {headers: {'User-Agent': 'Fastidious'}}).then((response) => response.json());
}
