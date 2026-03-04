package com.ccb.piedade.repository;

import com.ccb.piedade.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {

    List<Item> findByAtivoTrue();
}
