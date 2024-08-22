package com.portfolio.band_go.controllers.mains;


import com.portfolio.band_go.Exceptions.MemberException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/trade")
@RequiredArgsConstructor
public class TradeController {

    @GetMapping("")
    public String login(Model model) {


        return "front/main/trade_page";
    }
}
