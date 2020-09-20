# Workspace Manager

Motivation Behind WSManager

* Tech keeps changing really fast, from native, to hadoop, to cloud, to microservices and so does the environment and workspace.
* Generally the setup required is acheved by inital developers working in the project using terminal, notepad, gedit, scripts etc.
* These things can generally be not shared across the users/developers. Also when the system crashs whole setup is gone, and needs to be recreated from scratch.
* Docs created for setup becomes outdated as the tech changes or updates, or with requirements, and if not updated properly becomes stale.


Developing WSManager with following requirements and features:

1. Workspace can be shared across developers and users. New users can easily onboard in notime as they do not have to do througn all the doc and can just click through to setup the workspace.
2. Workspace can be checked in to the git and can be versioned.
3. Status of the host can be monitored. Also multiple Hosts and workspaces can be used and monitored togather.
4. Tasks in workspace can be combined to acheive something higher.
5. Tasks can be executed and monitored parallely. Nice graphs and stats of host and tasks can be shown.
6. In case some of the setp do not work in the WS, it can be fixed via JIRAs, so the WS will be executable everytime, unlike document which can get outdated.
7. WS can be uploaded and shared in a common location so that any user can browse and select the doc and start using it.
8. Each task can be attached with discription and doc.
9. User should be able to add custom widgit/app, that can be plugged in by other users.
10. WS Publish to PDF or web-DOC.
11. Special options for showing docker container and other similar process status
12. Output of the tasks can be cached and retrived later.
13. Packages can be installed and complete programs can be run.
14. Provide basic file browsers, for containers as well.
15. Provide basic terminal facility.
16. Provide AI assistance.



Enter Bash Command in this way

```bash
java -version
```

Enter links in this way

* [Java SE](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [sbt](http://www.scala-sbt.org/download.html)

## MISC

To build and run the project:

1. Use a command window to change into the example project directory, for example: `cd play-scala-hello-world-web`

2. Build the project. Enter: `sbt run`. The project builds and starts the embedded HTTP server. Since this downloads libraries and dependencies, the amount of time required depends partly on your connection's speed.

3. After the message `Server started, ...` displays, enter the following URL in a browser: <http://localhost:9000>

The Play application responds: `Welcome to the Hello World Tutorial!`
