/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const repoUrl = 'https://github.com/ryshu/enib-internships';

const siteConfig = {
    title: 'Internships manager',
    tagline: 'Application to manage ENIB interships system',
    url: 'https://ryshu.github.io',
    baseUrl: '/enib-internships/',

    // Used for publishing and more
    projectName: 'enib-internships',
    organizationName: 'enib',

    // For no header links in the top nav bar -> headerLinks: [],
    headerLinks: [
        { doc: 'docs-install', label: 'Docs' },
        { doc: 'api-index', label: 'API' },
        { doc: 'tuto-mentors', label: 'Tuto' },
        { page: 'help', label: 'Help' },
        { href: repoUrl, label: 'GitHub' },
    ],

    /* path to images for header/footer */
    headerIcon: 'img/favicon.ico',
    footerIcon: 'img/favicon.ico',
    favicon: 'img/favicon.ico',

    /* Colors for website */
    colors: {
        primaryColor: '#EA8A00',
        secondaryColor: '#D1C8B9',
    },

    copyright: `Copyright © ${new Date().getFullYear()} ENIB`,

    highlight: {
        theme: 'default',
    },

    // Add custom scripts here that would be placed in <script> tags.
    scripts: ['https://buttons.github.io/buttons.js'],

    // On page navigation for the current documentation page.
    onPageNav: 'separate',
    // No .html extensions for paths.
    cleanUrl: true,
};

module.exports = siteConfig;
