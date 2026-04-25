export default [
    {
        type: "confirm",
        name: "publicDomain",
        message: "Place this work in the public domain (no rights reserved)?"
    },
    {
        type: "confirm",
        name: "copyleft",
        message: "Require modifications to remain open source?",
        description: "Applies to anyone who receives your code"
    },
    {
        type: "confirm",
        name: "patent",
        message: "Need explicit patent grants?",
        description: "Protects against patent claims from contributors"
    },
    {
        type: "confirm",
        name: "network",
        message: "Should network users have same copyleft obligations?",
        description: "Applies copyleft even to remote service access (stricter enforcement)"
    },
    {
        type: "confirm",
        name: "strict",
        message: "Apply the strictest copyleft (affects everything)?",
        description: "Yes for GPL v3, No for MIT/Apache/ISC"
    }
];
