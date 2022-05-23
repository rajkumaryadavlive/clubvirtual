const ipfsAPI = require("ipfs-api");
var express = require('express');
var router = express.Router();
const fs = require("fs");
///////////
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./");
  },
  filename: function (req, file, cb) {
    let dat = new Date().getTime();
    cb(null, dat + "_" + file.originalname);
  },
});
var upload = multer({ storage: storage });
//var upload = multer({dest:'uploads/'});
/////////////

//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });


//Addfile router for adding file a local file to the IPFS network without any local node
router.get("/", (req, res) => {
  Art.find({}, function (err, allArts) {
    if (err) {
      console.log(err);
    } else {
      console.log(allArts)
      res.render("b1.ejs", { allArts: allArts });
    }
    //res.render("b1.ejs")
  });
});

router.post("/add", upload.single("myFile"), (req, res) => {
  try {
    
    console.log(req.body);
    // res.send(req.myFile);
    //res.redirect(`/addfile/${req.file.filename}`)
    ////////////////////
    let testFile = fs.readFileSync(`./${req.file.filename}`);
    //Creating buffer for ipfs function to add file to the system

    const path = `./${req.file.filename}`;

    try {
      fs.unlinkSync(path);
      //file removed
    } catch (err) {
      console.error(err);
    }

    let testBuffer = new Buffer(testFile);

    ipfs.files.add(testBuffer, async (err, file) => {
      if (err) {
        console.log(err);
      }
      //console.log(file);
      console.log(`https://gateway.ipfs.io/ipfs/${file[0].path}`);
      //res.send(`https://gateway.ipfs.io/ipfs/${ file[0].path }`)
      var hash1 = file[0].path;
      let metadata = JSON.parse(req.body.metadata);
      
      let testFile1 = {
        name: metadata.name,
        description: metadata.description,
        image: `https://gateway.ipfs.io/ipfs/${hash1}`,
        attributes: JSON.parse(metadata.attributes),
      };

      let testBuffer2 = new Buffer.from(JSON.stringify(testFile1));
      await ipfs.files.add(testBuffer2, function (err2, file2) {
        if (err2) {
          console.log(err2);
        }
        //console.log(file2);
        console.log(`https://gateway.ipfs.io/ipfs/${file2[0].path}`);
        
        ////////////////////////////////////////
        let hash2 = file2[0].path;
        let arr = {hash1,hash2};
        res.send(arr);
      });
    });
    ////////////
  } catch (err) {
    res.send(400);
  }
});



module.exports = router;