package imperial.drp.entity

import java.util.*
import javax.persistence.*

@Entity
open class Message(
        @field:Column(columnDefinition = "TIMESTAMP WITH TIME ZONE") var time: Calendar? = null,
        var message: String? = null
) {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    open val message_id: Long? = null


}