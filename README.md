# Rapidcron

[![npm version](https://badge.fury.io/js/rapidcron.svg)](https://badge.fury.io/js/rapidcron)

# Installation
Install the package using npm:
```bash
npm install rapidcron --save
```

or using yarn:
```bash
yarn add rapidcron
```

# Usage
Initialise the Rapidcron class with your [API Key](https://rapidcron.com/app/keys)

```ts
import Rapidcron
    from "rapidcron";

const rapidcron = new Rapidcron("API_KEY");

// Create a delayed task
await rapidcron.tasks.create({
    type: "delayed",
    nextRunAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
    request: {
        method: "POST",
        url: "https://example.com",
        body: JSON.stringify({
            hello: "world"
        })
    }
});

// Create a recurring task
await rapidcron.tasks.create({
    type: "recurring",
    recurrencePattern: "* * * * *", // Every minute
    request: {
        method: "POST",
        url: "https://example.com",
        body: JSON.stringify({
            hello: "world"
        })
    }
});
```

Read the [API Documentation](https://docs.rapidcron.com) for more information.

# License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
