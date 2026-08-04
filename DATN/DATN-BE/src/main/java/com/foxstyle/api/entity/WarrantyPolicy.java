package com.foxstyle.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "warranty_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarrantyPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "policy_id")
    private Integer policyId;

    @Column(name = "policy_name", nullable = false, length = 200)
    private String policyName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(name = "conditions", columnDefinition = "NVARCHAR(MAX)")
    private String conditions;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private Byte status = 1;
}
