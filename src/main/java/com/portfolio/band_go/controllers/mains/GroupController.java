package com.portfolio.band_go.controllers.mains;

import com.portfolio.band_go.services.SupabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequestMapping("/group")
public class GroupController {

    @Autowired
    private SupabaseService supabaseService;

    @GetMapping("/{groupId}")
    public String getGroup(@PathVariable("groupId") String groupId, Model model) {
        try {
            JsonNode groupProfile = supabaseService.getGroupProfile(groupId);
            model.addAttribute("group", groupProfile.get(0)); // Assuming the response is an array with a single object
            return "/front/main/group";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Failed to load group information.");
            return "/front/main/index";
        }
    }
}
