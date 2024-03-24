package com.portfolio.band_go.controllers.mains;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class MainController {

    @GetMapping
    public String index(Model model){

        return"front/main/index";
    }

    @GetMapping("/signup")
    public String signUp(Model model) {
        return "front/main/sign_up";
    }


}
