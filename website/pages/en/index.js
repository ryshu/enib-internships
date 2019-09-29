/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
    render() {
        const { siteConfig = '' } = this.props;
        const { baseUrl } = siteConfig;

        const SplashContainer = (props) => (
            <div className="homeContainer">
                <div className="homeSplashFade">
                    <div className="wrapper homeWrapper">{props.children}</div>
                </div>
            </div>
        );

        const PromoSection = (props) => (
            <div className="section promoSection">
                <div className="promoRow">
                    <div className="pluginRowBlock">{props.children}</div>
                </div>
            </div>
        );

        const Button = (props) => (
            <div className="pluginWrapper buttonWrapper">
                <a className="button" href={props.href} target={props.target}>
                    {props.children}
                </a>
            </div>
        );

        const Logo = (props) => (
            <div className="projectLogo">
                <img src={props.img_src} alt="Project Logo" />
            </div>
        );

        const ProjectTitle = () => (
            <h2 className="projectTitle">
                {siteConfig.title}
                <small>{siteConfig.tagline}</small>
            </h2>
        );

        return (
            <SplashContainer>
                <Logo img_src={`${baseUrl}img/certificate.svg`} />
                <div className="inner">
                    <ProjectTitle siteConfig={siteConfig} />
                    <PromoSection>
                        <Button href={`${baseUrl}docs/docs-install`}>GET STARTED</Button>
                        <Button href={`${baseUrl}docs/api-index`}>API</Button>
                        <Button href={`${baseUrl}help`}>GET HELP</Button>
                    </PromoSection>
                </div>
            </SplashContainer>
        );
    }
}

class Index extends React.Component {
    render() {
        const { config: siteConfig, language = '' } = this.props;
        const { baseUrl } = siteConfig;

        const Block = (props) => (
            <Container padding={['bottom', 'top']} id={props.id} background={props.background}>
                <GridBlock align="left" contents={props.children} layout={props.layout} />
            </Container>
        );

        const StudentsHistory = () => (
            <Block id="try">
                {[
                    {
                        content:
                            'For a student, it is quite easy to know where he is in the internship system to know what he has validated and what remains to be done.' +
                            "This management quickly becomes more complex when it comes to managing 300 students and knowing each one's experience.\n\n" +
                            'The internships manager allow you to setup internships history for every students and list them by criteria.',
                        image: `${baseUrl}img/progess_tracking.svg`,
                        imageAlign: 'left',
                        title: 'Students internships history',
                    },
                ]}
            </Block>
        );

        const InternshipsList = () => (
            <Block background="light">
                {[
                    {
                        content:
                            'Allow your students access to all the courses of your school simply, all by mastering the offers.\n\n' +
                            '* Professors and companies submit internship offers\n' +
                            '* Administrators validate or refuse internship offers\n' +
                            '* Students have access to all the offers that have been validated\n\n' +
                            'The currently implemented system is based on the ENIB internship system. But simple changes can modify it to suit your institution.\n\n' +
                            `If this is your case, do not hesitate to consult the section ["tutorials"](${baseUrl}docs/tuto-mentors) which will give you access to a set of guide to make changes directly on the code.`,
                        image: `${baseUrl}img/internships.svg`,
                        imageAlign: 'right',
                        title: 'Database of available internships',
                    },
                ]}
            </Block>
        );

        const Campaign = () => (
            <Block background="light">
                {[
                    {
                        content:
                            'The third issue managed in this project is the implementation of campaign.' +
                            'These campaigns are intended to simplify the assignment of internship referrals on the school side. \n\n' +
                            '* Campaign creation by type of internship\n' +
                            '* Comment for each tutoring proposal\n' +
                            '* Validation by the administrator of internships assignments',
                        image: `${baseUrl}img/campaign.svg`,
                        imageAlign: 'right',
                        title: 'Campaign for the assignment of tutors',
                    },
                ]}
            </Block>
        );

        return (
            <div>
                <HomeSplash siteConfig={siteConfig} language={language} />
                <div className="mainContainer">
                    <InternshipsList />
                    <StudentsHistory />
                    <Campaign />
                </div>
            </div>
        );
    }
}

module.exports = Index;
