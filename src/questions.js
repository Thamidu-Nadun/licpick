export default [
    {
        type: "confirm",
        name: "publicDomain",
        message: "Can anyone use, modify, and sell your code without asking you?",
        description: "This means you want to give up all your rights and let anyone do anything with your code"
    },
    {
        type: "confirm",
        name: "copyleft",
        message: "If someone modifies your code, must they share those changes publicly?",
        description: "This ensures improvements are shared back with everyone"
    },
    {
        type: "confirm",
        name: "patent",
        message: "Do you want protection if someone claims you used their patented technology?",
        description: "This covers you if your code unknowingly includes someone's patented idea"
    },
    {
        type: "confirm",
        name: "network",
        message: "If someone runs your code as a service online, must they share their changes?",
        description: "Example: If you run code on a website, should you have to share your customizations?"
    },
    {
        type: "confirm",
        name: "strict",
        message: "Do you want the strictest sharing rules (everything using your code must be shared)?",
        description: "This is the most restrictive - best if you want maximum sharing of improvements"
    }
];
