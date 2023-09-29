const { EntitySchema } = require('typeorm');
//const { Base } = require('./BaseModel');



class Client{
    // Define additional properties specific to AAA entity
    constructor() {
       // super(); // Call the constructor of the Base entity to inherit its properties
        this.id = { primary: true, type: 'uuid', generated: 'uuid' };
        this.clientName = { type: 'varchar' };
        this.postalCode = { type: 'varchar', nullable: true };
        this.address = { type: 'varchar', nullable: true };
        this.telephone = { type: 'varchar' };
   
        this.isdeleted = { type: 'smallint'};
       
        this.createdAt = { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' };
        this.updatedAt = { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' };
        this.createdBy = { type: 'varchar' , nullable: true};
        this.updatedBy = { type: 'varchar', nullable: true};
      }
     
    }


module.exports = new EntitySchema({
    name: 'Client',
    tableName: 'clients',
    columns: new Client(),
    relations: {
        project: {
            type: "one-to-many", 
            target: "Project",
            inverseSide: "Client",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }
         
      },
});


/* 


INSERT INTO public.clients (id, "clientName", "postalCode", "address", "telephone", "isdeleted", "createdBy", "updatedBy", "createdAt", "updatedAt") VALUES
('012bdd24-3286-4670-9b82-70f6ef664b25', 'Ethiopian statistics service', '1143', 'Addis Ababa', '+251111564226', 0, NULL, NULL, '2022-10-28 09:35:40', '2022-11-08 14:58:01'),
('17b991a5-664f-4034-adbe-141451fbb3bc', 'ASTU', '3000', 'Addis Ababa', '+251931988789', 0, NULL, NULL, '2022-10-24 03:04:41', '2022-10-24 03:04:41'),
('1fb61f8e-f9dc-4405-8d38-c9e11ed6b1e1', 'Ministry of Innovation and Technology', '2490', 'Addis Ababa', '0911446582', 1, NULL, NULL, '2022-10-25 11:14:06', '2022-10-25 11:16:14'),
('285c68de-bb2e-4376-abaa-5da2f8fc5f40', 'Ethiopian Shipping and Logistic Service Enterprise', NULL, 'Addis Ababa, sub city Kirkos, woreda 07', '251115514097', 0, NULL, NULL, '2022-11-05 20:35:06', '2022-11-05 20:35:06'),
('32c5766d-4a72-42ea-be38-9a5d15d2717d', 'AMU', '4996033974', 'Areba minch', '4996033974', 0, NULL, NULL, '2022-11-11 13:25:27', '2022-11-11 13:25:27'),
('333619e1-e803-470a-afaa-c4179d9a8ef0', 'Industrial Parks Development Corporation', '2458', 'Yeka sub-City, Woreda 07, House No., IPDC Building', '0116616396', 0, NULL, NULL, '2022-10-27 06:23:35', '2022-10-27 06:23:35'),
('3663f5ba-13d5-4f4a-a5b0-f13f2b25bc6c', 'Siinqee Bank', NULL, 'Kazanchis, Odaa Tower Addis Ababa ,Ethiopia', '+251911535740', 0, NULL, NULL, '2022-11-08 13:02:03', '2022-11-08 13:02:03'),
('3a3e1acf-6bf2-418b-ae02-5880241d9240', 'Ministry of Finance', '1245', 'Addis Ababa', '0912260321', 0, NULL, NULL, '2023-05-29 13:15:18', '2023-05-29 13:15:18'),
('3b2e7460-dbcb-4d1c-9d60-a5c2e6b767e7', 'Nokia', NULL, 'Bole A.A', '+971566853888', 0, NULL, NULL, '2022-12-28 16:34:10', '2022-12-28 16:34:10'),
('3daa58fe-a3a7-4468-a87b-8587275ffa19', 'Yonas', '2121', 'a.a', '0911420876', 0, NULL, NULL, '2023-05-20 03:22:02', '2023-05-20 03:22:02'),
('3ff0ec33-a931-42ba-89a2-61d1eb7b1576', 'Nokia', NULL, NULL, '+91 7290020676', 0, NULL, NULL, '2022-12-28 16:47:14', '2022-12-28 16:47:14'),
('45567df4-20fb-4dbc-9cdf-d8aaab9959e4', 'Ethswitch S.c', '124563', 'Kazanchis', '0911252326', 1, NULL, NULL, '2022-11-16 15:23:50', '2022-11-16 15:27:05'),
('45db3f62-00cb-4406-a1c4-872d8c9de059', 'IE Networks Solutions PLC', '122521', 'Festival 22 Infront of Awraris Hotel', '251-115570544', 0, NULL, NULL, '2022-12-08 20:14:26', '2023-06-09 13:51:15'),
('5aaaaf1f-8740-4d83-8031-e32bcfeb7ff7', 'jimma university', '6040', 'Jimma', '+251 47 111 84 00', 0, NULL, NULL, '2022-11-11 22:39:41', '2022-11-11 22:39:41'),
('5c3ad833-1e68-42fb-96fe-496b8436200e', 'Nokia', NULL, 'Bole A.A', '+971566853888', 0, NULL, NULL, '2022-12-28 16:34:10', '2022-12-28 16:34:10'),
('61309675-8948-4a65-a308-27682837f4c7', 'Bahirdar University', '79', 'Bahirdar, Ethiopia', '0583206015', 0, NULL, NULL, '2022-10-25 05:18:26', '2022-10-25 11:16:23'),
('73cadb0b-b055-4711-a59b-3a3eb526c678', 'Synergy Corp.Consulting', '1000', 'Addis Ababa', '0913645440', 0, NULL, NULL, '2023-01-04 13:06:43', '2023-01-04 13:06:43'),
('7da79617-2dc5-4bd3-9afe-f5203b3c35cb', 'Ethiopian Shipping and Logistic Service Enterprise', NULL, 'Addis Ababa, sub city Kirkos, woreda 07', '251115514097', 0, NULL, NULL, '2022-11-05 20:35:06', '2022-11-05 20:35:06'),
('860bc14d-4094-4d97-b835-65393306cf1c', 'Bunna Bank', '12345', 'Arat kilo', '0940392834', 0, NULL, NULL, '2023-03-09 14:45:26', '2023-03-09 14:45:26'),
('92799e0a-9973-4f98-b8b3-ff764acd1ae0', 'Africa Union Commission', '3243', 'Roosevelt Street W21K19, Addis Ababa, Ethiopia', '+251115517844', 0, NULL, NULL, '2022-11-07 02:32:28', '2022-11-07 02:32:28'),
('9cee6fa0-45ff-4ef2-9b44-9fa6befd5eaa', 'EOTC', NULL, 'Mexico Wabeshebbele', '251-911481031', 0, NULL, NULL, '2023-05-23 21:14:23', '2023-05-23 21:14:23'),
('b4607ded-2a6c-49ca-bcab-ac7b32cabb9d', 'Nokia', NULL, 'Bole A.A', '+971566853888', 0, NULL, NULL, '2022-12-28 16:34:10', '2022-12-28 16:34:10'),
('b612e9a8-4da3-474c-a9a3-a48a53272a48', 'Ministry of Innovation and Technology', '2490', 'Addis Ababa', '0911446582', 1, NULL, NULL, '2022-10-25 11:11:45', '2022-10-25 11:16:34'),
('b7d17d64-6b56-4300-9c3a-6e7b84d740d0', 'JU', '1234', 'Jimma', '25194723457', 0, NULL, NULL, '2023-02-25 16:50:33', '2023-02-25 16:50:33'),
('bba83a36-e453-4bf0-aa05-5dbc0a432e29', 'Test', '100', 'aa', '0908353430', 1, NULL, NULL, '2023-01-10 13:52:51', '2023-01-10 13:53:51'),
('be6c29ab-de8d-48d4-ad1a-400c098523b1', 'Ethiopian pharmaceuticals supply agency', '480', 'Addis Ababa', '011-27-51770', 0, NULL, NULL, '2023-02-07 22:46:53', '2023-02-07 22:46:53'),
('c0f85caf-80c1-40f7-b1fc-9e3f86688575', 'Dire Dawa University', '1362', 'Dire Dawa', '251251111501', 0, NULL, NULL, '2022-12-14 13:00:30', '2022-12-14 13:00:30'),
('c2676c91-67e5-4209-8d74-0a4dc7266977', 'Ethiopian Pharmaceuticals Supply Agency', '21904', 'Addis Abeba', '0112751770', 0, NULL, NULL, '2022-12-14 12:59:11', '2022-12-14 12:59:11'),
('c54431f2-f28b-46e9-b55e-dfc7b0663c2e', 'Ministry of Innovation and Technology', '2490', 'Addis Ababa', '0911446582', 0, NULL, NULL, '2022-10-25 11:15:47', '2022-10-25 11:15:47'),
('cbc54837-80ba-4d9b-a42b-79e11d4f8c28', 'Bahirdar University', '79', 'Bahirdar, Ethiopia', '0583206015', 0, NULL, NULL, '2022-11-11 15:19:36', '2022-11-11 15:19:36'),
('cc833ed4-a899-4ff0-b0af-3e7ea2b31473', 'Nokia', NULL, 'Bole A.A', '+971566853888', 0, NULL, NULL, '2022-12-28 16:34:10', '2022-12-28 16:34:10'),
('cd9b4bbb-767f-4541-8e07-157ff8f2eb6b', 'Ministry of Trade and Regional Integration Ethiopia', '1143', 'Bole 12/13', '+251915574020', 0, NULL, NULL, '2022-10-28 11:32:50', '2022-10-28 11:32:50'),
('cdbdd369-8240-4807-bf95-720f6532035a', 'Office of Auditor', '32145', 'Filamingo', '+251653962', 0, NULL, NULL, '2023-04-26 20:00:04', '2023-04-26 20:00:04'),
('ce7c1e45-694f-444e-8e28-73fcf88889c5', 'Ethiopian News Agency', '30231', 'Addis Ababa', '0912324256', 0, NULL, NULL, '2023-05-03 23:26:40', '2023-05-03 23:26:40'),
('eb44934d-7950-4cd2-9feb-246c39a9afd8', 'Nokia', NULL, 'Bole A.A', '+971566853888', 0, NULL, NULL, '2022-12-28 16:34:10', '2022-12-28 16:34:10'),
('f0ba3f9d-205b-4385-a791-33d0627efff5', 'Commercial Bank of Ethiopia', '255', 'Gambia Street', '+251 115515004', 0, NULL, NULL, '2022-11-05 20:07:34', '2022-11-05 20:07:34'),
('f4422e25-2085-42b8-b621-fd512cef2bd2', 'Ethiopian Commodity Exchange', 'NA', 'Addis Ababa', '251115547020', 0, NULL, NULL, '2022-12-14 13:03:14', '2022-12-14 13:03:14'),
('f837147f-ebe7-4694-a3ba-0adc44b7a860', 'Ethswitch S.c', '12456', 'Kazanchis', '0911253645', 0, NULL, NULL, '2022-11-16 15:28:21', '2022-11-16 15:28:21'),
('fac7f712-aea2-4860-b4c9-987939e79200', 'VFS', '5410000231', 'Saudi', '2348077594106', 0, NULL, NULL, '2023-04-04 20:37:25', '2023-04-04 20:37:25'),
('fb1aaf46-bd20-4ee0-95ab-449d867981b2', 'Adiss Ababa University', '8085', 'Addis Ababa, Ethiopia', '+251-115-570544', 0, NULL, NULL, '2023-01-03 13:23:53', '2023-01-03 13:23:53'),
('fb42a1bf-e17c-40d1-a061-c931614888a0', 'Bunna Bank', '12345', 'Arat kilo', '0940392834', 0, NULL, NULL, '2023-03-09 14:45:26', '2023-03-09 14:45:26'); */