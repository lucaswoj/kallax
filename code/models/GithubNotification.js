// @flow

const Model = require('../Model');
const ModelArray = require('../ModelArray');

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

module.exports = class GithubNotification extends Model<Props> {

    static all: ModelArray<GithubNotification> = new ModelArray(() => {

        const pages = [fetchPage(0)];

        function fetchPage(index) {
            return fetch(`https://api.github.com/notifications?access_token=${process.env.GITHUB_TOKEN}&page=${index}`)
                .then((response) => response.json());
        }

        return {
            length: pages[0].then((page) => page.length),
            fetch: (index: number): Promise<GithubNotification> =>
                pages[0].then((page) => new GithubNotification(page[index]))
        };
    });

};
