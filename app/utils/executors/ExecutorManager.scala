package utils.executors

class ExecutorManager {

  //Map[TaskID,ExecutionHelper]
  val executors = scala.collection.concurrent.TrieMap[String, ExecutionHelper]()


}
