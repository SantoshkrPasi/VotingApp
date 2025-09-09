package com.voting.votingapp.services;

import com.voting.votingapp.model.OptionVote;
import com.voting.votingapp.model.Poll;
import com.voting.votingapp.repositories.PollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PollService {

    @Autowired
    private PollRepository pollRepository;

    public List<Poll> getAllPolls() {
      return pollRepository.findAll();
    }

    public Poll createPoll(Poll poll) {
        return pollRepository.save(poll);
    }

    public Optional<Poll> getPollById(Long id) {
        return pollRepository.findById(id);
    }

    public void vote(Long pollId, int optionIndex)
    {
        // Get Poll From DB
       Poll poll = pollRepository.findById(pollId)
               .orElseThrow(()-> new RuntimeException("Poll Not Found"));

       // Get All Options
        List<OptionVote> options = poll.getOptions();

        // If Index for Vote is not valid , throw error
        if(optionIndex < 0 || optionIndex >= options.size()){
            throw new IllegalArgumentException("Invalid option index");
        }

        // Get Selected Option
        OptionVote selectedOption = options.get(optionIndex);

        // Increment vote for selected option
        selectedOption.setVoteCount(selectedOption.getVoteCount() + 1);

        // Save Incremented Option into the database
        pollRepository.save(poll);

    }
}
