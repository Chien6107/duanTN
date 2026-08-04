package com.foxstyle.api.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Integer reviewId;
    private Integer userId;
    private String userFullName;
    private String username;
    private String userEmail;
    private String userPhone;
    private Integer productId;
    private String productName;
    private Byte rating;
    private String comment;
    private LocalDateTime reviewDate;
}
