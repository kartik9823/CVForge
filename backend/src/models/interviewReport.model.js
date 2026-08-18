const mongoose = require("mongoose");

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
});

const behaviorialQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
}, {
    _id: false
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job Description is Required"]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestion: [technicalQuestionSchema],
    behaviorialQuestion: [behaviorialQuestionSchema],
    skillGaps: [skillGapSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [true, "Job title is required"]
    }
}, {
    timestamps: true
});

interviewReportSchema.virtual('technicalQuestions')
    .get(function () {
        return this.technicalQuestion;
    })
    .set(function (val) {
        this.technicalQuestion = val;
    });

interviewReportSchema.virtual('behavioralQuestions')
    .get(function () {
        return this.behaviorialQuestion;
    })
    .set(function (val) {
        this.behaviorialQuestion = val;
    });

interviewReportSchema.set('toJSON', { virtuals: true });
interviewReportSchema.set('toObject', { virtuals: true });

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;