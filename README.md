# Pet Connect Plus
My sys tem will provide more improved opertaional efficiency for the shelters and the pet owners.  The target users are Adopters/pet owners and Admin shelter staff/pet owners depending on the process needed at the time.  The process also increase pets services will be provided to the pets in timely manner depending on the needed services.

## Description

Problem Statement: My proposal is for a Pet Adoption Connect and Owner to Sitter platform for my Capstone Project.  Because animal shelters often have to rely on manual or outdated systems to manage per records and adoption applications it has created inefficiencies delayed responses to adopters, they have a hard time tracking post-adoption follow-ups.  As well as owners needing to effectively communicate to pet sitters the needs that need to be met on daily basis.  The owners can keep track of pet sitters and the tasks that are required of them from day to day.An in-depth paragraph about your project and overview of use.

Proposed Solution: Pet Adoption/Owner Connect which is a full-stack web application that helps streamline the adoption process.  The platform enables users to browse available pets during the adoption process which will provide administrators tools to manage pet records, review applications and schedule follow-up reminders.  In addition, owners will be able to create tasks for pet sitters to take care of during the care process of the animals.  This will also create the connection between the owners and the centers that provide services for the pets after adoption for care.

## Getting Started

### Dependencies

* Describe any prerequisites, libraries, OS version, etc., needed before installing program.
* ex. Windows 10

### Installing

* How/where to download your program
* Any modifications needed to be made to files/folders

### Executing program

* How to run the program

* Step-by-step bullets

code blocks for commands

## Help

Any advise for common problems or issues.

command to run if program contains helper info

## Authors

Contributors names and contact info

Anna Marie Johnson 
ajohnson53169@gmail.com

## Version History

* 0.2
* Various bug fixes and optimizations
* See [commit change]() or See [release history]()
* 0.1
* Initial Release

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [dbader](https://github.com/dbader/readme-template)
* [zenorocha](https://gist.github.com/zenorocha/4526327)
* [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)

<!-- Add this to your frontend README -->

## Running Pet Connect Plus locally

### Prerequisites
Node.js 18+
Your Spring Boot backend running on localhost:8080

### Setup

1. Clone the frontend repo
bash
git clone https://github.com/AMJ0h531/petconnect--client
cd petconnect--client

2. Install dependencies
bash
npm install

3. Create your .env file
bash
cp .env.example .env
# .env already points to localhost:8080 for local dev

4. Start the development server
bash
npm run dev

Open http://localhost:5173

### Building for AWS deployment
bash
# Sets VITE_API_URL to your EC2 address, outputs to dist/
VITE_API_URL=http://your-ec2-ip:8080/api npm run build

# Upload dist/ folder to S3
aws s3 sync dist/ s3://your-bucket-name --delete

### Demo credentials (from seed data)
| Role    | Username       | Password   |
|---------|---------------|------------|
| Admin   | shelter_admin  | admin123   |
| User    | user_anna      | admin123   |