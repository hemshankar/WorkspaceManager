package controllers

import javax.inject._
import models.Task
import play.api.mvc._
import utils.executors.ExecutionHelper
//import play.api.libs.json.{JsError, JsResult, JsValue, Json, Writes}
import play.api.libs.json._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class WSController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def getWS() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.ws("MyWorkspace", "This ws is to create kubernetes"))
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
      execHelper.waitForCompletion()
      Ok(Json.toJson(Task(taskID, cmd, execHelper.getAllLogs())))
    } catch {
      case e:Exception => {
        e.printStackTrace()
        Ok(Json.toJson(Task(taskID, cmd, e.getMessage + "\n" + e.getStackTrace.map(x => x.toString).mkString("\n"))))
      }
      case t : Throwable => {
        t.printStackTrace()
        Ok(Json.toJson(Task(taskID, cmd,  t.getMessage + "\n" +  t.getStackTrace.map(x => x.toString).mkString("\n"))))
      }
    }
  }
}