package utils.general

import java.io.File
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

object PersistUtils {
  def saveToFile(content:String, fName:String): Boolean = {
    try {
      import java.io._
      val pw = new PrintWriter(new File(fName))
      pw.write(content)
      pw.close
      true
    }catch {
      case t:Throwable => {
        t.printStackTrace()
        false
      }
    }
  }

  def copyFile(sourceFilename:String, destinationFilename:String):Boolean = {
    import java.nio.file.{Files, Paths, StandardCopyOption}
    try {
      val path = Files.copy(
        Paths.get(sourceFilename),
        Paths.get(destinationFilename),
        StandardCopyOption.REPLACE_EXISTING
      )
      if (path != null) {
        println(s"Copied the file $sourceFilename successfully to $destinationFilename")
        true
      } else {
        println(s"could NOT move the file $sourceFilename")
        false
      }
    }catch {
      case t:Throwable => {
        t.printStackTrace()
        false
      }
    }
  }

  def readFile(fname:String):String = {
    try {
      import scala.io.Source
      Source.fromFile(fname).getLines.toList.mkString("\n")
    }catch{
      case t:Throwable => {
        t.printStackTrace()
        ""
      }
    }
  }
  def getListOfFiles(dir: String):List[File] = {
    val d = new File(dir)
    if (d.exists && d.isDirectory) {
      d.listFiles.filter(_.isFile).toList
    } else {
      List[File]()
    }
  }

  /**
   * deletes only file
   * @param fname
   * @return
   */
  def deleteFile(fname:String) ={
    val d = new File(fname)
    if (d.exists && !d.isDirectory) {
      d.delete()
    }
  }
}


