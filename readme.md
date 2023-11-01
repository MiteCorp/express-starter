# Starter ExpressJS
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Framework Starter ExpressJS Typescript with Prisma ORM

## Server Requirement
- NodeJS 20.3.1+
- MySQL / MongoDB / PostgreSQL 

## Installation

```
git clone https://github.com/MiteCorp/express-starter
```

After clone this repository, you must setup .env
```bash
cp .env.example .env
```

Format database environment
```
DATABASE_URL="mysql://root:password@localhost:3306/database-name"
```

After that, please follow this instruction
```
npm install
npm run build
npm start
```

## Usage
You can access this API in localhost is
```
http://localhost:4000
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)