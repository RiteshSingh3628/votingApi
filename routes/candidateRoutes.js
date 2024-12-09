const express = require('express')
const router = express.Router();
const Candidate = require('../modals/Candidate')
const User = require('../modals/User')
const {jwtAuthMiddleware} = require('../jwt');
const { countBy } = require('lodash');


// checks the role of the person who is entring a data is admin or not
const checkAdminRole = async (userId)=>{
    try{
        const user = await User.findById(userId);
        return user.role === 'admin'
    }catch(err){
        return false;
    }
}
 
// POST route to add a candiadate
router.post('/',jwtAuthMiddleware, async(req,res)=>{
    
    try{

        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message:"user has not admin role"});
        }
        const data = req.body //Assuming the request body conatians the candidate data
    
        // create a new user document using the Mongoose modal
        const newCandidate = new Candidate(data);
    
        // save the mew user to the  database
        const response = await newCandidate.save()
        console.log("data saved");
        res.status(200).json({response:response})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"Internal Server Error"})
    }

})


//candidate data update route

router.put('/:candidateID',jwtAuthMiddleware,async (req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:"user has not admin role"});
        }

        const candiadateId = req.params.candidateID;
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candiadateId,updatedCandidateData,{
            new: true, //Return the updated document
            newValidators:true //Run Mongoose validation
        })

        if(!response){
            return res.status(404).json({error:"candidate not found"});
        }

        console.log("candidte data updated");
        res.status(200).json(response)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"Internal Server Error"})
    }
})

// candidate delete router
router.delete('/:candidateID',jwtAuthMiddleware,async (req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:"user has not admin role"});
        }

        const candiadateId = req.params.candidateID;

        const response = await Candidate.findByIdAndDelete(candiadateId)

        if(!response){
            return res.status(404).json({error:"candidate not found"});
        }

        console.log("candidate deleted");
        res.status(200).json(response)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"Internal Server Error"})
    }
})


// let's start voting
router.post('/vote/:candidateID',jwtAuthMiddleware,async (req,res)=>{
    // no admin can vote 
    // user can only vote for once
    const candiadateId = req.params.candidateID;
    const userId = req.user.id;

    try{
        // Find the candidate documnet with the specified candidateId
        const candidate = await Candidate.findById(candiadateId);
        if(!candidate){
            return res.status(404).json({message:"candidate not found"})
        }
        // fetching user data from token
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:'user not found'})
        }

        if(user.isVoted){
            return res.status(404).json({message:"You have already voted"})
        }

        if(user.role === 'admin'){
            res.status(403).json({message:"admin is not allowed to vote"})
        }

        // update the candidate document to record the vote
        candidate.votes.push({user:userId})
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true
        await user.save()

        res.status(200).json({message:'Vote recorded successfully'})
    }
    catch(err){
        
        console.log("err")
    }

    
})


//vote count

router.get('vote/count/',async(req,res)=>{
    // find all candidates and sort then by voteCount in descending order
    const candidate = await Candidate.find().sort(({voteCount:'desc'}));
    //map the candidates to only return their name and votecount
    const voteRecord = candidate.map((data)=>{
        return {
            party: data.party,
            count: data.voteCount
        }
    })

    return res.status(200).json(voteRecord)
})

module.exports = router;