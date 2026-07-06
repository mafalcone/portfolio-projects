RULES = [
    {
        "id": "input_event_monitoring",
        "title": "Input/event monitoring references",
        "weight": 25,
        "tokens": [
            "listener",
            "hook",
            "monitor",
            "event tap",
            "global event",
            "keyboard",
            "mouse",
        ],
        "explanation": (
            "References to input or event monitoring can be legitimate, but they "
            "deserve review when combined with background execution, file output "
            "or external communication."
        ),
    },
    {
        "id": "background_execution",
        "title": "Background execution patterns",
        "weight": 15,
        "tokens": [
            "threading",
            "daemon",
            "background",
            "while true",
            "while(true)",
            "timer",
            "scheduler",
        ],
        "explanation": (
            "Long-running or background behavior should be reviewed to confirm "
            "that it is visible, intentional and easy for users to stop."
        ),
    },
    {
        "id": "local_file_output",
        "title": "Local file output",
        "weight": 20,
        "tokens": [
            "open(",
            "write(",
            ".txt",
            ".log",
            "temp",
            "cache",
            "local file",
        ],
        "explanation": (
            "Local file writes may be normal application behavior. Review should "
            "confirm what data is written, where it is stored and whether users "
            "expect that output."
        ),
    },
    {
        "id": "external_communication",
        "title": "External communication references",
        "weight": 25,
        "tokens": [
            "requests.",
            "socket.",
            "webhook",
            "smtp",
            "telegram",
            "discord",
            "http://",
            "https://",
        ],
        "explanation": (
            "Outbound communication should be reviewed when code also collects "
            "local events, reads files or produces local output."
        ),
    },
    {
        "id": "startup_autostart",
        "title": "Startup/autostart references",
        "weight": 25,
        "tokens": [
            "startup",
            "autostart",
            "registry",
            "runonce",
            "schtasks",
            "launch agent",
            "login item",
        ],
        "explanation": (
            "Startup references increase review priority because software may "
            "continue running after reboot or without a clear user action."
        ),
    },
]
