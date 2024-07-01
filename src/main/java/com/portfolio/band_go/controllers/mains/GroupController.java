package com.portfolio.band_go.controllers.mains;

import com.portfolio.band_go.services.SupabaseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.databind.JsonNode;

@Controller
@RequestMapping("/group")
public class GroupController {

    @Autowired
    private SupabaseService supabaseService;

    @GetMapping("/{groupId}")
    public String getGroup(@PathVariable("groupId") String groupId,Model model) {
        try {
            JsonNode groupProfile = supabaseService.getGroupProfile(groupId);
            if (groupProfile != null && groupProfile.isArray() && groupProfile.size() > 0) {
                JsonNode group = groupProfile.get(0);
                model.addAttribute("group_name", group.get("group_name").asText());
                model.addAttribute("group_introduce", group.get("group_introduce").asText());
                model.addAttribute("is_public", group.get("is_public").asBoolean());
                model.addAttribute("created_at", group.get("created_at").asText());
                model.addAttribute("updated_at", group.get("updated_at").asText());
                model.addAttribute("is_active", group.get("is_active").asBoolean());
                model.addAttribute("group_id", group.get("group_id").asText());
            }
            return "/front/main/group";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Failed to load group information.");
            return "/front/main/index";
        }
    }

    @GetMapping("/invite")
    public String acceptInvite(@RequestParam("groupId") String groupId,
                               @RequestParam("userId") String userId,
                               Model model) {
        model.addAttribute("groupId", groupId);
        model.addAttribute("userId", userId);
        return "/front/main/invite_group";
    }

    @GetMapping("/schedule")
    public String addSchedule(Model model) {
        return "front/main/group_schedule";
    }

}
