package com.portfolio.band_go.controllers.mains;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Objects;

@Controller
@RequestMapping("/trade")
@RequiredArgsConstructor
public class TradeController {

    @GetMapping("")
    public String TradePage(
            @RequestParam(name = "category", required = false) String categorySlug,
            @RequestParam(name = "mcategory", required = false) String mCategorySlug,
            @RequestParam(name = "minprice", required = false) String minPrice,
            @RequestParam(name = "maxprice", required = false) String maxPrice,
            @RequestParam(name = "status", required = false) String status,
            Model model) {

        model.addAttribute("category", categorySlug);
        model.addAttribute("mCategory", mCategorySlug);
        model.addAttribute("minPrice", minPrice);
        model.addAttribute("maxPrice", maxPrice);
        model.addAttribute("status", status);

        return "front/main/trade_page";
    }
}
