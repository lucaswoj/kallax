import * as React from "react";

class Application extends React.Component<{}, {}> {

    render() {
        return <div>

            <h1>Hello World!</h1>

            We are using node {process["versions"]["node"]},
            Chromium {process["versions"]["chrome"]},
            and Electron {process["versions"]["electron"]}.

        </div>;
    }

}

export = Application;
