package com.foxstyle.api.repository;

import com.foxstyle.api.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findAllByOrderBySentAtDesc(Pageable pageable);
    List<ChatMessage> findByChannelIdOrderBySentAtAsc(String channelId);
}
