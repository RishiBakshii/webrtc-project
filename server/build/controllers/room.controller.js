"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.getOtherUsersRooms = exports.getRoomsByUser = exports.createRoom = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const room_model_1 = require("../models/room.model");
const createRoom = async (req, res) => {
    try {
        const { roomId, roomname } = req.body;
        if (!req.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!roomId || !roomname) {
            return res.status(400).json({ message: 'roomId and roomname are required' });
        }
        const existingRoom = await room_model_1.Room.findOne({ roomId });
        if (existingRoom) {
            return res.status(409).json({ message: 'Room already exists' });
        }
        const room = await room_model_1.Room.create({
            userId: req.userId,
            roomId,
            roomname,
        });
        return res.status(201).json({
            message: 'Room created successfully',
            room,
        });
    }
    catch {
        return res.status(500).json({ message: 'Failed to create room' });
    }
};
exports.createRoom = createRoom;
const getRoomsByUser = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const rooms = await room_model_1.Room.find({ userId: req.userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            message: 'Rooms fetched successfully',
            rooms,
        });
    }
    catch {
        return res.status(500).json({ message: 'Failed to fetch rooms' });
    }
};
exports.getRoomsByUser = getRoomsByUser;
const getOtherUsersRooms = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const rooms = await room_model_1.Room.find({ userId: { $ne: req.userId } }).sort({ createdAt: -1 });
        return res.status(200).json({
            message: 'Other users rooms fetched successfully',
            rooms,
        });
    }
    catch {
        return res.status(500).json({ message: 'Failed to fetch other users rooms' });
    }
};
exports.getOtherUsersRooms = getOtherUsersRooms;
const deleteRoom = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const rawId = id?.trim() ?? '';
        if (!rawId || !mongoose_1.default.isValidObjectId(rawId)) {
            return res.status(400).json({ message: 'A valid MongoDB room id is required' });
        }
        const room = await room_model_1.Room.findOneAndDelete({
            _id: new mongoose_1.default.Types.ObjectId(rawId),
            userId: req.userId,
        });
        if (!room) {
            return res.status(404).json({ message: 'Room not found or not allowed' });
        }
        return res.status(200).json({
            message: 'Room deleted successfully',
            _id: String(room._id),
            roomId: room.roomId,
        });
    }
    catch {
        return res.status(500).json({ message: 'Failed to delete room' });
    }
};
exports.deleteRoom = deleteRoom;
