package com.foxstyle.api.repository;

import com.foxstyle.api.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Integer> {
    List<Article> findAllByOrderByCreatedAtDesc();
    List<Article> findByStatusOrderByPublishedAtDesc(String status);
    boolean existsBySlug(String slug);
    Optional<Article> findBySlug(String slug);
}
