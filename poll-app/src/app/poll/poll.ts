import { Component, OnInit } from '@angular/core';
import { PollService } from '../service/poll';
import { Poll as PollModel } from '../poll.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './poll.html',
  styleUrl: './poll.css'
})
export class Poll implements OnInit{ 
  newPoll: PollModel = {
    // id : 0,
    question: '',
    options: [
      {optionText: '', voteCount: 0},
      {optionText: '', voteCount: 0}
    ]
  } as PollModel;
  polls : PollModel[] = [];
  constructor(private pollService: PollService ) {}
  ngOnInit(): void {
    this.loadPolls();
  }
  loadPolls() 
  {
    this.pollService.getPolls().subscribe({
      next: (data) => {
        this.polls = data;
      },
      error: (error) => {
        console.error('Error fetching polls:', error);
      }
    });
  }

  addOption(){
    this.newPoll.options.push({optionText: '', voteCount: 0});
  }

  createPoll() {
    this.pollService.createPoll(this.newPoll).subscribe({
      next: (createPoll) =>{
        this.polls.push(createPoll);
        this.resetPoll();
      },
      error: (error) => {
        console.error('Error creating poll:', error);
      }
    });
  }

 resetPoll(){
  this.newPoll = {
    id : 0,
    question: '',
    options: [
      {optionText: '', voteCount: 0},
      {optionText: '', voteCount: 0}
    ]
  };
 }

 vote(pollId: number, optionIndex: number){
  this.pollService.vote(pollId, optionIndex).subscribe({
     next: () =>{
       const poll = this.polls.find(p => p.id === pollId);
       if (poll) {
        poll.options[optionIndex].voteCount += 1;
       }
      },
      error: (error) => {
        console.error('Error voting on a poll :', error);
      }
    });
}

  trackByIndex(index: number): number {
    return index;
  }
}
