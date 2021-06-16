package controllers

import java.nio.file.{Files, Paths}

import javax.inject._
import models.Task
import play.api.mvc._
import utils.executors.{ExecutionHelper, ExecutorManager}
import utils.general.{GeneralUtils, PersistUtils}
//import play.api.libs.json.{JsError, JsResult, JsValue, Json, Writes}
import play.api.libs.json._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class WSController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  //temp Save Location. Later persistence has to happen in the cloud
  val DEFAULT_SAVE_FOLDER = "/data/home/devbld/wsFiles"
  val DEFAULT_SAVE_FILE = "ws.txt"
  val DEFAULT_SAVE_LOCATION = DEFAULT_SAVE_FOLDER + "/" + DEFAULT_SAVE_FILE
  val delimiter = "_._._._._"

  def getWS() = Action { implicit request: Request[AnyContent] =>
    var tasks = PersistUtils.readFile(DEFAULT_SAVE_LOCATION)
    val cps = getCPLists
    println(cps)
    if(tasks.equals("")){
      tasks = "NO TASKS FOUND"
    }
    Ok(views.html.ws("MyWorkspace", "This ws is to create kubernetes", tasks, cps))
  }

  def getAllRunningTasks() = Action { implicit request: Request[AnyContent] =>
    val runningTaskIds = ExecutorManager.executors.map((_._1)).mkString(",")
    println("runningTaskIds: " + runningTaskIds)
    Ok(runningTaskIds)
  }

  def getWSwithCP(cp:String) = Action { implicit request: Request[AnyContent] =>
    /*var tasks = PersistUtils.readFile(DEFAULT_SAVE_FOLDER + "/" + cp)
    val cps = getCPLists
    println(cps)
    if(tasks.equals("")){
      tasks = "NO TASKS FOUND"
    }
    Ok(views.html.ws("MyWorkspace", "This ws is to create kubernetes", tasks, cps))*/
    PersistUtils.copyFile(DEFAULT_SAVE_FOLDER + "/" + cp, DEFAULT_SAVE_LOCATION)
    Redirect("/ws")
  }


  // get checkpoint list
  def getCPLists(): List[(String,String)] = {
    val files = PersistUtils.getListOfFiles(DEFAULT_SAVE_FOLDER)
    files.filter(_.getName.contains(DEFAULT_SAVE_FILE + "_")).map(x => (x.getName, x.getName.split(delimiter).last))
  }

  def getTaskSample()= Action { implicit request: Request[AnyContent] =>
    Ok(views.html.task())
  }

  def createCP()  = Action { implicit request: Request[AnyContent] =>
    implicit val writes = Json.writes[Task]
    val paramsMap = request.body.asFormUrlEncoded.get.map(x => (x._1 -> x._2.head))
    try {
      val content = paramsMap.getOrElse("content", "")
      val cpName = paramsMap.getOrElse("cpName", "") //cpName = CheckPoint Name
      Files.createDirectories(Paths.get(DEFAULT_SAVE_FOLDER))
      val dateTime = GeneralUtils.getDateTime()
      PersistUtils.saveToFile(content, DEFAULT_SAVE_LOCATION)
      PersistUtils.copyFile(DEFAULT_SAVE_LOCATION, DEFAULT_SAVE_LOCATION + "_" + dateTime + delimiter + cpName)
      Ok(DEFAULT_SAVE_FILE + "_" + dateTime + delimiter + cpName)
    } catch {
      case e:Throwable => {
        e.printStackTrace()
        Ok(e.getStackTrace.map(x => x.toString).mkString("\n"))
      }
    }
  }

  def deleteCP()  = Action { implicit request: Request[AnyContent] =>
    implicit val writes = Json.writes[Task]
    val paramsMap = request.body.asFormUrlEncoded.get.map(x => (x._1 -> x._2.head))
    try {
      val fname = paramsMap.getOrElse("fname", "") //cpName = CheckPoint Name
      PersistUtils.deleteFile(DEFAULT_SAVE_FOLDER + "/" + fname)
      Ok("Deleted Checkpoint")
    } catch {
      case e:Throwable => {
        e.printStackTrace()
        Ok(e.getStackTrace.map(x => x.toString).mkString("\n"))
      }
    }
  }

  def saveWSTemp()  = Action { implicit request: Request[AnyContent] =>
    implicit val writes = Json.writes[Task]
    val paramsMap = request.body.asFormUrlEncoded.get.map(x => (x._1 -> x._2.head))
    try {
      val content = paramsMap.getOrElse("allContent", "")
      Files.createDirectories(Paths.get(DEFAULT_SAVE_FOLDER))
      PersistUtils.saveToFile(content, DEFAULT_SAVE_LOCATION)
      Ok("Saved Successfully")
    } catch {
      case e:Throwable => {
        e.printStackTrace()
        Ok(e.getStackTrace.map(x => x.toString).mkString("\n"))
      }
    }
  }


  def execute()  = Action { implicit request: Request[AnyContent] =>
    implicit val writes = Json.writes[Task]
    var taskID = ""
    var cmd = ""
    val paramsMap = request.body.asFormUrlEncoded.get.map(x => (x._1 -> x._2.head))
    try {
      taskID = paramsMap.getOrElse("task_id", "0000")
      cmd = paramsMap.getOrElse("cmd", "echo 'No CMD'")
      val execHelper = ExecutionHelper.execute(cmd)
      ExecutorManager.executors.addOne(taskID, execHelper)
      println("Added " + taskID)
      //execHelper.waitForCompletion()
      Ok("STARTED")
    } catch {
      case e:Throwable => {
        e.printStackTrace()
        Ok(e.getStackTrace.map(x => x.toString).mkString("\n"))
      }
    }
  }

  def abort() = Action { implicit request: Request[AnyContent] =>
    implicit val writes = Json.writes[Task]
    var taskID = ""
    val paramsMap = request.body.asFormUrlEncoded.get.map(x => (x._1 -> x._2.head))
    try {
      taskID = paramsMap.getOrElse("task_id", "0000")
      println("Aborting: " + taskID)
      ExecutorManager.executors.get(taskID).get.stopExecution()
      Ok("ABORTED")
    }catch {
      case e:Throwable => {
        e.printStackTrace()
        Ok(e.getMessage)
      }
    }
  }

  def isCompleted() = Action { implicit request: Request[AnyContent] =>
    implicit val writes = Json.writes[Task]
    var taskID = ""
    val paramsMap = request.body.asFormUrlEncoded.get.map(x => (x._1 -> x._2.head))
    try {
      taskID = paramsMap.getOrElse("task_id", "0000")
      println("Checking for TaskID: " + taskID)
      println(ExecutorManager.executors)
      ExecutorManager.executors.get(taskID) match {
        case Some(eh) => {
          if(eh.isCompleted()) {
            Ok("COMPLETED")
          }else{
            Ok("RUNNING")
          }
        }
        case None => Ok("TASK_NOT_FOUND")
      }
    }catch {
      case e:Throwable => {
        e.printStackTrace()
        Ok(e.getMessage)
      }
    }
  }

  def getLogs() = Action { implicit request: Request[AnyContent] =>
    implicit val writes = Json.writes[Task]
    var taskID = ""
    val paramsMap = request.body.asFormUrlEncoded.get.map(x => (x._1 -> x._2.head))
    try {
      taskID = paramsMap.getOrElse("task_id", "0000")
      println("Fetching log for TaskID: " + taskID)
      println(ExecutorManager.executors)
      ExecutorManager.executors.get(taskID) match {
        case Some(eh) => {
          val logs = eh.getAllLogs()
          if(eh.isCompleted()){
            ExecutorManager.executors.remove(taskID)
          }
          Ok(logs)
        }
        case None => Ok("Task Completed")
      }
    }catch {
      case e:Throwable => {
        e.printStackTrace()
        Ok(e.getMessage)
      }
    }
  }
}