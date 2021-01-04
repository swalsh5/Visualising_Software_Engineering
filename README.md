# Visualising_Software_Engineering
Assignment for 3rd Year Software Engineering module. Used ASP.NET Core. Program should output a basic overview of a user's profile along with a network graph and pie chart

## To Run on Visual Studio 
To run the code you need to have Microsoft Visual Studio 2019 installed.
Clone the code and copy to VS.
Run on IIS Express

## To Run on Docker
Docker can't run on my workspace however it should be possible to run on a container in Docker.
To do this: clone the code, navigate to the project folder in command prompt and enter:
  ```
  docker build -t VisualisingSoftwareEngineering
  docker run -d -p 8080:80 -- name myapp VisualisingSoftwareEngineering
  ```
