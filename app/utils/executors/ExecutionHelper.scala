package utils.executors

import java.io.{BufferedInputStream, BufferedReader, InputStreamReader, PrintWriter}
import java.nio.charset.StandardCharsets
import java.util
import java.util.concurrent.LinkedBlockingQueue

import scala.sys.process.{Process, _}

class ExecutionHelper(cmd:String) {

  val logQ = new LinkedBlockingQueue[String]()
  var completed = false //this variable is becoming absolute as we have process.isAlive available
  var process:Process = null


  def start(): ExecutionHelper ={
    val cmd_ = Seq("bash","-c", cmd); //.split(" ").toSeq
    println(cmd_)
    process = (cmd_) run new ProcessIO(_.close(), fetchOutput, fetchError)
    this
  }

  private def fetchOutput(output: java.io.InputStream): Unit ={

    val bf : BufferedInputStream = new BufferedInputStream(output)

    val r : BufferedReader = new BufferedReader(
      new InputStreamReader(bf, StandardCharsets.UTF_8));

    var line = r.readLine()
    while(line != null){
      logQ put line;
      line = r.readLine()
    }
    //completed = process.isAlive()

    r.close()
    bf.close()
    output.close()

  }

  private def fetchError(err: java.io.InputStream): Unit ={
    val bf : BufferedInputStream = new BufferedInputStream(err)

    val r : BufferedReader = new BufferedReader(
      new InputStreamReader(bf, StandardCharsets.UTF_8));

    var line = r.readLine()
    while(line != null){
      logQ put line;
      line = r.readLine()
    }

    //completed = process.isAlive()

    r.close()
    bf.close()
    err.close()
  }


  def isCompleted():Boolean = {
    !process.isAlive()
  }

  def getAllLogs(): String = {
    val allLogs = new util.ArrayList[String]()
    logQ.drainTo(allLogs)
    allLogs.toArray().mkString("","\r\n","")
  }

  def stopExecution(): Unit ={
    completed = true;
    process.destroy()
  }

  def waitForCompletion():Unit = {
    //TODO: Remove sleep and find a better way to call back, or block.
    while(process != null && process.isAlive()){
      Thread.sleep(1000)
    }
  }
}

object ExecutionHelper {
  def execute(newCmd:String): ExecutionHelper = {
    (new ExecutionHelper(newCmd)).start()
  }
}