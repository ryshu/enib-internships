/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;

function Help() {
    return (
        <div className="docMainWrapper wrapper">
            <Container className="mainContainer documentContainer postContainer">
                <div className="post">
                    <header className="postHeader">
                        <h1>Need help?</h1>
                    </header>
                    <p>
                        This project was originally created for management as part of a supervised
                        student project. It is maintained and improved by the students who will
                        follow according to the needs of the ENIB.
                    </p>
                    <p>
                        Feel free to suggest improvements, report bugs or failures and fork the
                        project to suit your use case.
                    </p>
                </div>
            </Container>
        </div>
    );
}

module.exports = Help;
