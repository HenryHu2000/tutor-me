package imperial.drp.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CookieValue
import org.springframework.web.bind.annotation.RequestMapping
import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletResponse

@Controller
class SitePageController {

    @RequestMapping("/")
    fun homePage() : String {
        return "index"
    }

    @RequestMapping("/videoCall")
    fun videoCallPage(@CookieValue(value = "user_id", required = false) userId: String, response: HttpServletResponse)  {
        response.setHeader("Location", "http://localhost:3000/")
        response.status = 302
        response.addCookie(Cookie("user_id", userId))
        println("redirected, this was the cookie $userId")
    }

    @RequestMapping("/voiceCall")
    fun voiceCallPage() : String {
        return "voiceCall"
    }
    @RequestMapping("/textChat")
    fun textChatPage() : String {
        return "textChat2"
    }




}