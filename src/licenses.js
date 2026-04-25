export default [
    {
        id: "mit",
        name: "MIT License",
        traits: { copyleft: false, patent: false },
        weight: { permissive: 3 },
        explain: [
            "Allows commercial use",
            "No requirement to open source changes",
            "Very simple and popular"
        ]
    },
    {
        id: "apache-2.0",
        name: "Apache License 2.0",
        traits: { copyleft: false, patent: true },
        weight: { patent: 4 },
        explain: [
            "Includes patent protection",
            "Allows commercial use",
            "Good for companies"
        ]
    },
    {
        id: "gpl-3.0",
        name: "GNU GPL v3",
        traits: { copyleft: true, strict: true },
        weight: { copyleft: 5, strict: 3 },
        explain: [
            "Requires open source distribution",
            "Strong copyleft protection"
        ]
    },
    {
        id: "agpl-3.0",
        name: "GNU Affero GPL v3",
        traits: { copyleft: true, strict: true, network: true },
        weight: { copyleft: 5, strict: 4 },
        explain: [
            "Stricter than GPL - requires source for network use",
            "Requires open source distribution",
            "Strongest copyleft protection"
        ]
    },
    {
        id: "bsd-3-clause",
        name: "BSD 3-Clause License",
        traits: { copyleft: false, patent: false },
        weight: { permissive: 3 },
        explain: [
            "Allows commercial use",
            "Requires attribution",
            "Simple and straightforward"
        ]
    },
    {
        id: "isc",
        name: "ISC License",
        traits: { copyleft: false, patent: false },
        weight: { permissive: 3 },
        explain: [
            "Functionally equivalent to MIT",
            "Allows commercial use",
            "Simple and permissive"
        ]
    },
    {
        "id": "mpl-2.0",
        "name": "Mozilla Public License 2.0",
        "traits": {
            "copyleft": true,
            "patent": true,
            "fileScopedCopyleft": true
        },
        "weight": {
            "copyleft": 3,
            "patent": 4
        },
        "explain": [
            "Weak copyleft - file-scoped",
            "Includes patent protection",
            "Balance between permissive and copyleft"
        ]
    },
    {
        "id": "bsl-1.0",
        "name": "Boost Software License 1.0",
        "traits": {
            "copyleft": false,
            "patent": false
        },
        "weight": {},
        "explain": [
            "Very permissive license",
            "Allows commercial use",
            "Popular for C++ libraries"
        ]
    },
    {
        "id": "lgpl-3.0",
        "name": "GNU Lesser GPL v3",
        "traits": {
            "copyleft": true,
            "strict": false
        },
        "weight": {
            "copyleft": 4
        },
        "explain": [
            "Allows linking with non-GPL code",
            "Requires modifications to be open source",
            "Weaker copyleft than GPL"
        ]
    },
    {
        "id": "unlicense",
        "name": "The Unlicense",
        "traits": {
            "copyleft": false,
            "patent": false,
            "publicDomain": true
        },
        "weight": {
            "permissive": 5
        },
        "explain": [
            "Dedicates work to public domain",
            "No restrictions on use",
            "Similar to CC0 but for software"
        ]
    }
];