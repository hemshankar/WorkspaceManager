package utils.general

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

object GeneralUtils {

  def getDateTime():String = {
    val currentDate = LocalDateTime.now.format(DateTimeFormatter.ofPattern("YYYY_MM_dd_HH_mm_ss"))
    currentDate
  }

}
