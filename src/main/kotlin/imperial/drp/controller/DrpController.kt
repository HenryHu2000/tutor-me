package imperial.drp.controller

import imperial.drp.dao.ConversationRepository
import imperial.drp.dao.MessageRepository
import imperial.drp.dao.TaskRepository
import imperial.drp.dao.PersonRepository
import imperial.drp.entity.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import java.text.SimpleDateFormat
import java.util.*
import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletResponse
import kotlin.collections.ArrayList

@Controller
class DrpController {
    @Autowired
    private val taskRepository: TaskRepository? = null

    @Autowired
    private val personRepository: PersonRepository? = null

    @Autowired
    private val conversationRepository: ConversationRepository? = null

    @Autowired
    private val messageRepository: MessageRepository? = null

    @RequestMapping("/")
    fun app(@CookieValue(value = "user_id", required = false) userId: Long?, model: Model): String {
        if (userId != null) {
            var userOpt = personRepository!!.findById(userId)
            if (userOpt.isPresent) {
                var user = userOpt.get()
                model.addAttribute("username", user.name!!)
                model.addAttribute("nowTime", Calendar.getInstance())
                model.addAttribute("userType", getUserType(user))
                when (user) {
                    is Tutor -> {
                        val tasks =
                                taskRepository!!.findByTutorOrderByStartTimeAsc(personRepository!!.findByName(user.name!!)[0])
                        val tuteeTasksMap = TreeMap<Tutee, MutableList<Task>>()
                        user.tutees!!.forEach {
                            tuteeTasksMap[it] = ArrayList()
                        }
                        tasks.forEach {
                            tuteeTasksMap[it.tutee!!]!!.add(it)
                        }
                        model.addAttribute("tuteeTasksMap", tuteeTasksMap)
                    }
                    is Tutee -> {
                        val tasks =
                                taskRepository!!.findByTuteeOrderByStartTimeAsc(personRepository!!.findByName(user.name!!)[0])
                        model.addAttribute("tasks", tasks)
                    }
                }
            }
        }
        return "homepage"
    }

    @RequestMapping("/chats_page")
    fun textChatPage(@CookieValue(value = "user_id", required = false) userId: Long?, model: Model): String {
        if (userId != null) {
            /* Conversations with this user_id */
            val person = personRepository!!.findById(userId).get()
            println("$person ${person.name} ${person.id}")
            val convs = conversationRepository!!.findAllByUser1OrUser2(person, person)
            println("Conversations $convs")
            if (convs.isNotEmpty()) {
                val recentChatsMap = mutableMapOf<Person, List<Message>>()

                for (conv in convs) {
                    var otherUser = conv.user1
                    if (conv.user1!!.id == userId) {
                        otherUser = conv.user2
                    }
                    println("Other user for $conv ${conv.id} ${conv.user1} ${conv.user2} is $otherUser")

                    var messages = messageRepository!!.findByConversationOrderByTimeAsc(conv)
                    println("Before sorted $messages")
                    messages = messages.sortedBy { it.time }
                    println("After sorting $messages")
                    recentChatsMap[otherUser!!] = messages
                }
                model.addAttribute("recentChatsMap", recentChatsMap)
            }
        }
        return "chats_page"
    }

    fun getAllTutors(): List<Tutor> {
        val everyone = personRepository!!.findAll()
        val tutors = mutableListOf<Tutor>()
        for (person in everyone) {
            if (person is Tutor) {
                tutors.add(person)
            }
        }
        return tutors
    }

    @RequestMapping("/calls_page")
    fun videoCallPage(): String {
//        val person1 = personRepository!!.findById(1).get()
//        val person2 = personRepository!!.findById(2).get()
//        val conv = Conversation(person1, person2)
//        conversationRepository!!.save(conv)
//        messageRepository!!.save(Message(conv, GregorianCalendar(), "Hello World"))
//        val person11 = personRepository!!.findById(1).get()
//        val person21 = personRepository!!.findById(2).get()
//        val conv1 = Conversation(person11, person21)
//        conversationRepository!!.save(conv1)
//        messageRepository!!.save(Message(conv1, GregorianCalendar(), "Latest message"))
        return "build/index"
    }

    @RequestMapping("/voiceCall")
    fun voiceCallPage(): String {
        return "voiceCall"
    }

    fun getUserType(person: Person): String {
        return (
                when (person) {
                    is Tutor -> {
                        "tutor"
                    }
                    is Tutee -> {
                        "tutee"
                    }
                    else -> {
                        "tutor"
                    }
                })
    }

    @PostMapping("/login")
    fun login(
            @RequestParam(value = "username") username: String,
            response: HttpServletResponse,
            model: Model
    ): String {
        var matchingUsers = personRepository!!.findByName(username)
        if (matchingUsers.isNotEmpty()) {
            val userId = matchingUsers[0].id
            val cookie = Cookie("user_id", userId.toString())
            response.addCookie(cookie)
            val userType = getUserType(matchingUsers[0])
            response.addCookie(Cookie("user_type", userType))
        }
        return "redirect"
    }

//    @GetMapping("/signup")
//    fun signupGet(
//        response: HttpServletResponse,
//        model: Model
//    ): String {
//        return "signup"
//    }

    @PostMapping("/signup")
    fun signupPost(
            @RequestParam(value = "username") username: String,
            @RequestParam(value = "userType", required = false) userType: String?,
            response: HttpServletResponse,
            model: Model
    ): String {
        if (userType != null) {
            var matchingUsers = personRepository!!.findByName(username)
            if (matchingUsers.isEmpty()) {
                val user = when (userType) {
                    "tutor" -> {
                        Tutor(username, emptyList())
                    }
                    "tutee" -> {
                        Tutee(username)
                    }
                    else -> {
                        throw IllegalArgumentException("unknown user type")
                    }
                }
                personRepository.save(user)
                val userId = user.id
                val cookie = Cookie("user_id", userId.toString())
                val typeCookie = Cookie("user_type", userType)
                response.addCookie(cookie)
                response.addCookie(typeCookie)
            }
        }
        return "redirect"
    }

    @RequestMapping("/logout")
    fun logout(response: HttpServletResponse, model: Model): String {
        val cookie = Cookie("user_id", null)
        cookie.maxAge = 0
        response.addCookie(cookie)
        val cookie2 = Cookie("user_type", null)
        cookie2.maxAge = 0
        response.addCookie(cookie2)
        return "redirect"
    }

    @PostMapping("/addtutee")
    fun addtutee(
            @CookieValue(value = "user_id") userId: Long,
            @RequestParam(value = "tutee_name") tuteeName: String,
            response: HttpServletResponse,
            model: Model
    ): String {
        personRepository!!.findById(userId).ifPresent {
            if (it is Tutor) {
                var matchingPersons = personRepository!!.findByName(tuteeName)
                if (matchingPersons.isNotEmpty()) {
                    val person = matchingPersons[0]
                    if (person is Tutee) {
                        var newTutees = ArrayList<Tutee>(it.tutees)
                        newTutees.add(person)
                        it.tutees = newTutees
                        personRepository.save(it)
                    }
                }
            }
        }
        return "redirect"
    }

    @PostMapping("/addtask")
    fun addtask(
            @CookieValue(value = "user_id") userId: Long,
            @RequestParam(value = "start_time") startTime: String,
            @RequestParam(value = "end_time") endTime: String,
            @RequestParam(value = "content") content: String,
            @RequestParam(value = "tutee_id") tuteeId: Long,
            response: HttpServletResponse,
            model: Model
    ): String {
        personRepository!!.findById(userId).ifPresent { person ->
            if (person is Tutor) {
                var tutee = personRepository!!.findById(tuteeId).get()
                if (tutee is Tutee) {
                    var sdf = SimpleDateFormat("yyyy-MM-dd'T'hh:mm")

                    var startCalendar = GregorianCalendar()
                    startCalendar.time = sdf.parse(startTime)

                    var endCalendar = GregorianCalendar()
                    endCalendar.time = sdf.parse(endTime)

                    if (startCalendar <= endCalendar) {
                        taskRepository!!.save(Task(startCalendar, endCalendar, person, tutee, content))
                    }
                }
            }
        }
        return "redirect"
    }

    @PostMapping("/deletetask")
    fun deletetask(
            @CookieValue(value = "user_id") userId: Long,
            @RequestParam(value = "task_id") taskId: Long,
            response: HttpServletResponse,
            model: Model
    ): String {
        personRepository!!.findById(userId).ifPresent { person ->
            if (person is Tutor) {
                taskRepository!!.findById(taskId).ifPresent {
                    if (it.tutor == person) {
                        taskRepository.delete(it)
                    }
                }
            }
        }
        return "redirect"
    }
}
