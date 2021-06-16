package utils.executors

object ExecutorManager {

  //Map[TaskID,ExecutionHelper]
  val executors = scala.collection.concurrent.TrieMap[String, ExecutionHelper]()
}
