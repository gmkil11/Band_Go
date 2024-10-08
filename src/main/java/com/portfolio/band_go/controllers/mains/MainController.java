package com.portfolio.band_go.controllers.mains;

import com.portfolio.band_go.Exceptions.MemberException;
import com.portfolio.band_go.services.CreateUuidService;
import com.portfolio.band_go.services.MemberInfoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute(new MemberException("에러"));

        return "front/main/login";
    }

    @GetMapping("/group")
    public String group(Model model) {
        return "front/main/group";
    }



    @PostMapping("/check-login")
    public ResponseEntity<?> checkLogin(@RequestBody Object session) {
        System.out.println(session);
        // 세션 정보를 검증하고 로그인 상태를 확인
        // 로그인되어 있지 않은 경우 로그인 페이지로 리다이렉션하는 응답을 반환
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    @GetMapping("/findRoom")
    public String findRoom(Model model)  {
        return "front/main/find_room";
    }

    @GetMapping("/profile-edit")
    public String profileEdit(Model model) {
        return "front/main/profile_edit";
    }

    @GetMapping("/mypage")
    public String myPage(@RequestParam("userId") String userId , Model model) {
        model.addAttribute("userId", userId);
        return "front/main/my_page";
    }

    @GetMapping("/region")
    public String regieon(Model model) {
        return "front/main/region";
    }

}
