package com.saintyves.server.repo;

import com.saintyves.server.model.MonthlySum;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonthlySumRepo extends MongoRepository<MonthlySum, String> {}
