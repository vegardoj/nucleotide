import org.junit.*;
import java.util.*;
import models.Analysis;
import play.test.*;
//import models.*;

public class BasicTest extends UnitTest {

    @Test
    public void createAndReceiveAnalysis() {
        // Create analysis and save it
        new Analysis("test", 23, 1.5, 0.1, 5).save();

        // Retrieve analysis
        Analysis a = Analysis.find("byName", "test").one();

        // Test
        assertNotNull(a);
        assertEquals("test", a.name);
    }
}
