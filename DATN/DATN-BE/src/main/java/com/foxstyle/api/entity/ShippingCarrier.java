package com.foxstyle.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shipping_carriers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingCarrier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "carrier_id")
    private Integer carrierId;

    @Column(name = "carrier_code", nullable = false, unique = true, length = 30)
    private String carrierCode;

    @Column(name = "carrier_name", nullable = false, length = 150)
    private String carrierName;

    @Column(name = "api_base_url", length = 500)
    private String apiBaseUrl;

    @Column(name = "api_token_encrypted", columnDefinition = "NVARCHAR(MAX)")
    private String apiTokenEncrypted;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private Byte status = 1;
}
