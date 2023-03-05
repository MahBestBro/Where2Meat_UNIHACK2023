# Where2Meat_UNIHACK2023

## Table of Contents

- [Images](#images) :file_folder:
- [Setup Requirements](#setup) :rocket:

<a name="images"></a>

## Images :file_folder:

Initial Page
![image](https://user-images.githubusercontent.com/64310471/222941549-a5c91b25-09c6-48a3-8a21-8501a06adac0.png)

Autocomplete Suggestions for search places
![image](https://user-images.githubusercontent.com/64310471/222941585-f6fddf99-46db-4b70-a7d6-8ecc21e915fe.png)

THe blue marker is the center point (you can hover over all the markers to see which location they are for)
![image](https://user-images.githubusercontent.com/64310471/222941674-2d7cdc3e-2077-4279-b666-e038869c812c.png)


<a name="setup"></a>

## Setup Requirements

The project consists of 2 main components, the client side or frontend and the server side or backend. These compoents can be found in the `client/` and `server/` folders respectively.

To run the project you will need to install a few components

1. [NodeJS](https://nodejs.org/en/)
2. Yarn - can be installed using npm (comes by default with node)
   1. `npm install -g yarn`

Next, you will need to create a `.env` file inside `server/`

```bash
API_KEY=yourApiKey
```

## Libraries and APIs Used

1. Google Maps API
2. Google Places API
3. All other NodeJS basedd libraries can be found in the `package.json` file

## Future Plans

1. Be able to drag the center location marker to find a better or more ideal spot
2. 
