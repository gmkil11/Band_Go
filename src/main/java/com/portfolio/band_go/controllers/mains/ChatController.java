package com.portfolio.band_go.controllers.mains;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class ChatController {

    @GetMapping("/chat")
    public String chat() {

        return "/front/main/chat";
    }
}
